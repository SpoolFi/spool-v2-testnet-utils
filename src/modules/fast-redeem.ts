require('dotenv').config();
import { BigNumber, ethers } from 'ethers';
import ISmartVaultManager from "../abi/ISmartVaultManager.json";
import contracts from '../deploy/sepolia.contracts.json';

type RedeemBag = {
    smartVault: string;
    shares: BigNumber;
    nftIds: BigNumber[];
    nftAmounts: BigNumber[];
};

export async function fastRedeem() {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);
    const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY as string,
        provider,
    );

    const smartVaultManager = new ethers.Contract(
        contracts["SmartVaultManager"]["proxy"], ISmartVaultManager, signer
    );

    const shares = BigNumber.from(process.argv[3]);

    const strategies = await smartVaultManager.strategies();

    const slippages = [...Array(strategies.length)].map(() => []);

    const bag : RedeemBag = {
        smartVault: process.env.SMART_VAULT,
        shares: shares,
        nftIds: [],
        nftAmounts: [],
    };

    await smartVaultManager.redeemFast(bag, slippages);
}
