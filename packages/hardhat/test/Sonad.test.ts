import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Sonad", function () {
  let sonad: Contract;
  let monadToken: Contract;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;
  let tipper: HardhatEthersSigner;

  const MINIMUM_MONAD_HOLDING = ethers.parseEther("1");
  const POINTS_PER_VOTE = 10;

  beforeEach(async function () {
    [owner, creator, voter1, voter2, tipper] = await ethers.getSigners();

    // Deploy MockMonadToken
    const MockMonadTokenFactory = await ethers.getContractFactory("MockMonadToken");
    monadToken = await MockMonadTokenFactory.deploy();

    // Deploy Sonad
    const SonadFactory = await ethers.getContractFactory("Sonad");
    sonad = await SonadFactory.deploy(await monadToken.getAddress());

    // Give tokens to voters and tipper
    await monadToken.connect(voter1).faucet();
    await monadToken.connect(voter2).faucet();
    await monadToken.connect(tipper).faucet();
  });

  describe("Deployment", function () {
    it("Should set the correct Monad token address", async function () {
      expect(await sonad.monadToken()).to.equal(await monadToken.getAddress());
    });

    it("Should set the correct minimum holding", async function () {
      expect(await sonad.minimumMonadHolding()).to.equal(MINIMUM_MONAD_HOLDING);
    });

    it("Should set the correct owner", async function () {
      expect(await sonad.owner()).to.equal(owner.address);
    });
  });

  describe("Post Verification and Registration", function () {
    it("Should verify and register a post", async function () {
      const tweetId = "1234567890";
      const content = "This is a test tweet about #Monad";

      const tx = await sonad.verifyAndRegisterPost(tweetId, creator.address, content);
      await expect(tx).to.emit(sonad, "PostVerified").withArgs(1, tweetId, creator.address);

      const post = await sonad.getPost(1);
      expect(post.tweetId).to.equal(tweetId);
      expect(post.creator).to.equal(creator.address);
      expect(post.content).to.equal(content);
      void expect(post.verified).to.be.true;
      void expect(post.active).to.be.true;
      expect(post.litCount).to.equal(0);
      expect(post.shitCount).to.equal(0);
    });

    it("Should not allow duplicate tweet IDs", async function () {
      const tweetId = "1234567890";
      await sonad.verifyAndRegisterPost(tweetId, creator.address, "First tweet");

      await expect(sonad.verifyAndRegisterPost(tweetId, creator.address, "Second tweet")).to.be.revertedWith(
        "Tweet already registered",
      );
    });

    it("Should only allow owner to verify posts", async function () {
      await expect(
        sonad.connect(creator).verifyAndRegisterPost("123", creator.address, "Test"),
      ).to.be.revertedWithCustomError(sonad, "OwnableUnauthorizedAccount");
    });
  });

  describe("Voting System", function () {
    beforeEach(async function () {
      await sonad.verifyAndRegisterPost("123", creator.address, "Test tweet");
    });

    it("Should allow voting with sufficient Monad tokens", async function () {
      const tx = await sonad.connect(voter1).vote(1, true);
      await expect(tx).to.emit(sonad, "VoteCast").withArgs(1, voter1.address, true, POINTS_PER_VOTE, false);

      const post = await sonad.getPost(1);
      expect(post.litCount).to.equal(1);
      expect(post.shitCount).to.equal(0);

      const rewards = await sonad.getVoterRewards(voter1.address);
      expect(rewards.points).to.equal(POINTS_PER_VOTE);
    });

    it("Should not allow voting without sufficient Monad tokens", async function () {
      // Create a new signer and ensure they have no tokens
      const noTokenUser = ethers.Wallet.createRandom().connect(ethers.provider);
      await expect(sonad.connect(noTokenUser).vote(1, true)).to.be.revertedWith("Insufficient MONAD tokens to vote");
    });

    it("Should not allow double voting", async function () {
      await sonad.connect(voter1).vote(1, true);
      await expect(sonad.connect(voter1).vote(1, false)).to.be.revertedWith("Already voted on this post");
    });

    it("Should track shit votes correctly", async function () {
      await sonad.connect(voter1).vote(1, false);

      const post = await sonad.getPost(1);
      expect(post.litCount).to.equal(0);
      expect(post.shitCount).to.equal(1);
    });

    it("Should not allow voting on non-existent posts", async function () {
      await expect(sonad.connect(voter1).vote(999, true)).to.be.revertedWith("Post does not exist");
    });
  });

  describe("Tipping System", function () {
    beforeEach(async function () {
      await sonad.verifyAndRegisterPost("123", creator.address, "Test tweet");
    });

    it("Should allow tipping post creators", async function () {
      const tipAmount = ethers.parseEther("1");
      const creatorBalanceBefore = await ethers.provider.getBalance(creator.address);

      const tx = await sonad.connect(tipper).tipCreator(1, { value: tipAmount });
      await expect(tx).to.emit(sonad, "TipSent").withArgs(1, tipper.address, tipAmount);

      const creatorBalanceAfter = await ethers.provider.getBalance(creator.address);
      const expectedCreatorAmount = (tipAmount * 90n) / 100n; // 90% to creator

      expect(creatorBalanceAfter - creatorBalanceBefore).to.equal(expectedCreatorAmount);

      const post = await sonad.getPost(1);
      expect(post.totalTips).to.equal(tipAmount);
    });

    it("Should not allow zero tips", async function () {
      await expect(sonad.connect(tipper).tipCreator(1, { value: 0 })).to.be.revertedWith(
        "Tip amount must be greater than 0",
      );
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update minimum holding", async function () {
      const newMinimum = ethers.parseEther("5");

      const tx = await sonad.updateMinimumMonadHolding(newMinimum);
      await expect(tx).to.emit(sonad, "MinimumHoldingUpdated").withArgs(newMinimum);

      expect(await sonad.minimumMonadHolding()).to.equal(newMinimum);
    });

    it("Should allow owner to deactivate posts", async function () {
      await sonad.verifyAndRegisterPost("123", creator.address, "Test tweet");

      await sonad.deactivatePost(1);

      const post = await sonad.getPost(1);
      void expect(post.active).to.be.false;

      await expect(sonad.connect(voter1).vote(1, true)).to.be.revertedWith("Post is not active");
    });

    it("Should allow owner to withdraw protocol fees", async function () {
      await sonad.verifyAndRegisterPost("123", creator.address, "Test tweet");

      // Send a tip to generate fees
      const tipAmount = ethers.parseEther("1");
      await sonad.connect(tipper).tipCreator(1, { value: tipAmount });

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const contractBalance = await ethers.provider.getBalance(await sonad.getAddress());

      const tx = await sonad.withdrawProtocolFees();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      expect(ownerBalanceAfter + gasUsed - ownerBalanceBefore).to.equal(contractBalance);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await sonad.verifyAndRegisterPost("123", creator.address, "Test tweet 1");
      await sonad.verifyAndRegisterPost("456", creator.address, "Test tweet 2");
    });

    it("Should return creator posts", async function () {
      const creatorPosts = await sonad.getCreatorPosts(creator.address);
      expect(creatorPosts).to.deep.equal([1n, 2n]);
    });

    it("Should return total posts count", async function () {
      expect(await sonad.getTotalPosts()).to.equal(2);
    });

    it("Should check if user has voted", async function () {
      void expect(await sonad.hasUserVoted(voter1.address, 1)).to.be.false;

      await sonad.connect(voter1).vote(1, true);

      void expect(await sonad.hasUserVoted(voter1.address, 1)).to.be.true;
    });
  });
});
