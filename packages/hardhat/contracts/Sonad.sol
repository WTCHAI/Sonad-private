// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Sonad is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {

    struct TwitterPost {
        string tweetId;
        address creator;
        string content;
        uint256 timestamp;
        uint256 litCount;
        uint256 shitCount;
        uint256 totalTips;
        bool verified;
        bool active;
    }

    struct VoterReward {
        uint256 points;
        uint256 nftCount;
        bool hasVoted;
    }

    IERC20 public monadToken;
    uint256 public minimumMonadHolding = 1 * 10**18; // 1 MONAD token minimum
    uint256 public nextTokenId = 1;
    uint256 public postIdCounter = 1;

    uint256 public constant POINTS_PER_VOTE = 10;
    uint256 public constant NFT_DROP_CHANCE = 100; // 1% chance (1/100)
    uint256 public constant TIP_CREATOR_PERCENTAGE = 90; // 90% to creator, 10% to protocol

    mapping(uint256 => TwitterPost) public posts;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => VoterReward) public voterRewards;
    mapping(string => uint256) public tweetIdToPostId;
    mapping(address => uint256[]) public creatorPosts;

    event PostVerified(uint256 indexed postId, string tweetId, address indexed creator);
    event VoteCast(uint256 indexed postId, address indexed voter, bool isLit, uint256 points, bool nftAwarded);
    event TipSent(uint256 indexed postId, address indexed tipper, uint256 amount);
    event NFTMinted(address indexed recipient, uint256 tokenId);
    event MinimumHoldingUpdated(uint256 newMinimum);

    constructor(address _monadToken) ERC721("Sonad NFT", "SONAD") Ownable(msg.sender) {
        monadToken = IERC20(_monadToken);
    }

    modifier hasMinimumMonad() {
        require(
            monadToken.balanceOf(msg.sender) >= minimumMonadHolding,
            "Insufficient MONAD tokens to vote"
        );
        _;
    }

    modifier postExists(uint256 _postId) {
        require(_postId > 0 && _postId < postIdCounter, "Post does not exist");
        require(posts[_postId].active, "Post is not active");
        _;
    }

    function verifyAndRegisterPost(
        string memory _tweetId,
        address _creator,
        string memory _content
    ) external onlyOwner returns (uint256) {
        require(bytes(_tweetId).length > 0, "Tweet ID cannot be empty");
        require(_creator != address(0), "Invalid creator address");
        require(tweetIdToPostId[_tweetId] == 0, "Tweet already registered");

        uint256 postId = postIdCounter++;

        posts[postId] = TwitterPost({
            tweetId: _tweetId,
            creator: _creator,
            content: _content,
            timestamp: block.timestamp,
            litCount: 0,
            shitCount: 0,
            totalTips: 0,
            verified: true,
            active: true
        });

        tweetIdToPostId[_tweetId] = postId;
        creatorPosts[_creator].push(postId);

        emit PostVerified(postId, _tweetId, _creator);
        return postId;
    }

    function vote(uint256 _postId, bool _isLit) external hasMinimumMonad postExists(_postId) nonReentrant {
        require(!hasVoted[msg.sender][_postId], "Already voted on this post");

        hasVoted[msg.sender][_postId] = true;

        if (_isLit) {
            posts[_postId].litCount++;
        } else {
            posts[_postId].shitCount++;
        }

        voterRewards[msg.sender].points += POINTS_PER_VOTE;

        bool nftAwarded = false;
        if (_shouldAwardNFT()) {
            _mintRewardNFT(msg.sender);
            voterRewards[msg.sender].nftCount++;
            nftAwarded = true;
        }

        emit VoteCast(_postId, msg.sender, _isLit, POINTS_PER_VOTE, nftAwarded);
    }

    function tipCreator(uint256 _postId) external payable postExists(_postId) nonReentrant {
        require(msg.value > 0, "Tip amount must be greater than 0");

        TwitterPost storage post = posts[_postId];
        uint256 creatorAmount = (msg.value * TIP_CREATOR_PERCENTAGE) / 100;
        uint256 protocolAmount = msg.value - creatorAmount;

        post.totalTips += msg.value;

        (bool success, ) = payable(post.creator).call{value: creatorAmount}("");
        require(success, "Failed to send tip to creator");

        emit TipSent(_postId, msg.sender, msg.value);
    }

    function _shouldAwardNFT() private view returns (bool) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            postIdCounter
        ))) % NFT_DROP_CHANCE;

        return randomNumber == 0;
    }

    function _mintRewardNFT(address _recipient) private {
        uint256 tokenId = nextTokenId++;
        _safeMint(_recipient, tokenId);

        string memory tokenURI = string(abi.encodePacked(
            "https://api.sonad.xyz/nft/",
            Strings.toString(tokenId)
        ));
        _setTokenURI(tokenId, tokenURI);

        emit NFTMinted(_recipient, tokenId);
    }

    function getPost(uint256 _postId) external view returns (TwitterPost memory) {
        require(_postId > 0 && _postId < postIdCounter, "Post does not exist");
        return posts[_postId];
    }

    function getCreatorPosts(address _creator) external view returns (uint256[] memory) {
        return creatorPosts[_creator];
    }

    function getVoterRewards(address _voter) external view returns (uint256 points, uint256 nftCount) {
        VoterReward memory reward = voterRewards[_voter];
        return (reward.points, reward.nftCount);
    }

    function hasUserVoted(address _user, uint256 _postId) external view returns (bool) {
        return hasVoted[_user][_postId];
    }

    function getTotalPosts() external view returns (uint256) {
        return postIdCounter - 1;
    }

    function updateMinimumMonadHolding(uint256 _newMinimum) external onlyOwner {
        minimumMonadHolding = _newMinimum;
        emit MinimumHoldingUpdated(_newMinimum);
    }

    function deactivatePost(uint256 _postId) external onlyOwner postExists(_postId) {
        posts[_postId].active = false;
    }

    function withdrawProtocolFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }

    function setMonadToken(address _newMonadToken) external onlyOwner {
        require(_newMonadToken != address(0), "Invalid token address");
        monadToken = IERC20(_newMonadToken);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    receive() external payable {}
}