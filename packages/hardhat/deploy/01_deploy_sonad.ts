import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deploySonad: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying Sonad contracts with account:", deployer);

  // Deploy Mock Monad Token first
  const mockMonadToken = await deploy("MockMonadToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("MockMonadToken deployed at:", mockMonadToken.address);

  // Deploy Sonad contract
  const sonadContract = await deploy("Sonad", {
    from: deployer,
    args: [mockMonadToken.address],
    log: true,
    autoMine: true,
  });

  console.log("Sonad contract deployed at:", sonadContract.address);

  // Get the deployed contracts
  const sonad = await hre.ethers.getContract<Contract>("Sonad", deployer);
  const monadToken = await hre.ethers.getContract<Contract>("MockMonadToken", deployer);

  console.log("✅ Sonad deployment completed!");
  console.log("📝 Contract addresses:");
  console.log("   MockMonadToken:", await monadToken.getAddress());
  console.log("   Sonad:", await sonad.getAddress());
};

export default deploySonad;

deploySonad.tags = ["Sonad", "MockMonadToken"];