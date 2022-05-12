/* Moralis init code */
const serverUrl = "https://wh6c5mxg3jgg.usemoralis.com:2053/server";
const appId = "akSHAQo37D8Z4BOu98cQvqUHo72MED6s1Dis4hU5";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis",
    })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

window.onload = getBNBvalue();

async function getBNBvalue() {
  const BNBvalue = await Moralis.Web3API.token.getTokenPrice({address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", chain: "bsc"})
  console.log(BNBvalue);

  const Tokenvalue = await Moralis.Web3API.token.getTokenPrice({address: "0xc848b2616a6cc6ae86231876ef5c92ea2c45b0cb", chain: "bsc"})
  console.log(Tokenvalue);

  const ABI_BNB = [{"inputs":[],"name":"getAmountBNBInAssetPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Add ABI

  const options_BNB = {
  chain: "bsc",
  address: "0xC848b2616a6cc6AE86231876EF5C92EA2c45B0cb",
  function_name: "getAmountBNBInAssetPool",
  abi: ABI_BNB,
  }
  
  const assetBNB = await Moralis.Web3API.native.runContractFunction(options_BNB);
  console.log(assetBNB);
  let x = assetBNB/10**18
  let y = Math.ceil(BNBvalue["usdPrice"]);
  let finalValue = Math.ceil(x*y);

  console.log(BNBvalue["usdPrice"]);

  const ABI_Supply = [{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Add ABI

  const options_Supply = {
  chain: "bsc",
  address: "0xC848b2616a6cc6AE86231876EF5C92EA2c45B0cb",
  function_name: "getCirculatingSupply",
  abi: ABI_Supply,
  }
  const supply = await Moralis.Web3API.native.runContractFunction(options_Supply);
  console.log(supply/10**18)
  
  const options_PRICE = {
    address: "0xC848b2616a6cc6AE86231876EF5C92EA2c45B0cb",
    chain: "bsc",
    exchange: "PancakeSwapv2",
  };
  const TokenPrice = await Moralis.Web3API.token.getTokenPrice(options_PRICE);
  console.log(TokenPrice["usdPrice"])

  let x2 = TokenPrice["usdPrice"] * supply/10**18
  let y2 = Math.ceil(x2)
  let z2 = y2.toLocaleString("en-US")

  const options = { chain: 'bsc', address: "0xE73CED15B0ceD48428Dc5b49Cb0f0223590da003", token_address: "0xC848b2616a6cc6AE86231876EF5C92EA2c45B0cb" }
  const balances = await Moralis.Web3API.account.getTokenBalances(options);
  let stringBalance = JSON.stringify(balances);
  let singleBalance = stringBalance.slice(168,196);
  const TokenBalance = Math.ceil(singleBalance/10**18);
  console.log(singleBalance);
  console.log(balances);

  document.getElementById("resultAssetBNB").innerHTML = Math.ceil(assetBNB/10**18) + ' BNB @ $' + finalValue.toLocaleString("us-EN");

  document.getElementById("resultBurnedValue").innerHTML = '$' + Math.ceil(TokenBalance*((finalValue/(supply/10**18)).toFixed(10)));

  document.getElementById("resultMarketCap").innerHTML = '$' + z2;

  document.getElementById("resultFloorPrice").innerHTML = (finalValue/(supply/10**18)).toFixed(10);

  document.getElementById("resultTokenPrice").innerHTML = TokenPrice["usdPrice"].toFixed(10);


}


document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
