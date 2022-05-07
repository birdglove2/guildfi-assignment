import { ethers } from 'ethers';

// message used to sign from frontend to prove identity of wallet address
// this message must be the same as that of frontend
const MESSAGE = 'Hello from backend';

export class WalletAddress {
  static async verify(signature: string, walletAddress: string) {
    const decodedAddress = ethers.utils.verifyMessage(MESSAGE, signature);

    if (decodedAddress.toUpperCase() !== walletAddress.toUpperCase()) {
      // to prevent different message return different wallet address
      return false;
    }

    return true;
  }
}
