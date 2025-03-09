const hre = require("hardhat");

async function main() {
    // Deploy access control
    const AccessControl = await hre.ethers.getContractFactory("AccessControl");
    const accsessControl = await AccessControl.deploy();
    await accsessControl.deployed();
    console.log(`AccessControl deployed at ${accsessControl.address}`);
}

main().catch((err) => {console.log("Error: ", err); process.exitCode = 1});