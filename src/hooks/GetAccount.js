import { Banana } from '@rize-labs/banana-wallet-sdk/dist/BananaProvider'
import { Chains } from '@rize-labs/banana-wallet-sdk/dist/Constants' 

// creating chain specific instance of banana module
const jsonRpcProviderUrl = "https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4";
const bananaInstance = new Banana(Chains.mumbai, jsonRpcProviderUrl);


const GetAccount = async() => {
  const walletName = await bananaInstance.getWalletName();
  if(walletName) {
  // getting address for the walletName.
    const walletResponse = await bananaInstance.getWalletAddress(walletName)
    const address = walletResponse;
    return address;
  } else {
    return false;
  }
}
 
export {GetAccount, bananaInstance}
