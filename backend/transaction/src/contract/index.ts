import { BadRequestError } from '../common';
import { ethers } from 'ethers';
import { abi } from './abi/GEM.json';

export class GEMContract {
  public static getContractInstance() {
    const CONTRACT_ADDRESS = '0xbD820Fab7C02852f516B489EAd4893A1B1AFF203';
    const provider = new ethers.providers.InfuraProvider('rinkeby');

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    return { contract, provider };
  }

  // ============ READ ============

  /**
   *
   * @param address wallet address
   * @returns balance of GEM
   */
  public static getBalance = async (address: string) => {
    const { contract } = this.getContractInstance();

    const balanceBigNumber = await contract.balanceOf(address);
    const balance = balanceBigNumber.toString();
    return balance;
  };

  // ============ WRITE ============

  /**
   *
   * @param privateKey wallet privateKey for signing transaction
   * @param to addresss of the receipient
   * @param amount amount to transfer
   * @returns transaction
   */
  public static transfer = async (privateKey: string, to: string, amount: ethers.BigNumber) => {
    const { contract, provider } = this.getContractInstance();
    const wallet = new ethers.Wallet(privateKey, provider);

    const signedContract = contract.connect(wallet);

    // const callable = await signedContract.callStatic.transfer(to, amount);
    // if (!callable) {
    //   throw new BadRequestError('User has insufficient amount of token');
    // }

    let tx = await signedContract.transfer(to, amount);
    await tx.wait();

    return tx;
  };
}
