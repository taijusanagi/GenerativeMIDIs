import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  const [deployer] = await hre.ethers.getSigners();
  await hre.deployments.deploy("GenerativeMIDIsSeries1", {
    from: deployer.address,
    args: [],
    log: true,
  });
};

export default func;

func.tags = ["GenerativeMIDIsSeries1"];
func.dependencies = [];
