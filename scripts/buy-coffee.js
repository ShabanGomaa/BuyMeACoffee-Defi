// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address${idx} balance:`, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy and deploy it
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();

  // Check balances before the coffer purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("======Start===>>>>>");
  await printBalances(addresses);

  // buy the owner a coffee
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Ahmed", "Thanks for your help, pls accept my tip", tip);
  await buyMeACoffee.connect(tipper).buyCoffee("Mahmoud", "Big thanks :)", tip);
  await buyMeACoffee.connect(tipper).buyCoffee("Moustafa", "Again thanks", tip);

  // Check balances after coffee purchase
  console.log("<<<======== Print balances, after bought coffee ========>>>");
  await printBalances(addresses);

  // Withdraw funds
  await buyMeACoffee.connect(tipper).withdrawTips();
  console.log("<<<======== Print balances, after withdrawTips ========>>>");
  await printBalances(addresses);

  // Read all the memos left for the owner
  console.log("<<<======== Print memos ========>>>");

  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
