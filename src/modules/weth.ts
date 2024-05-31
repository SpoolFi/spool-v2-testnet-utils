require('dotenv').config();
import { ethers } from 'ethers';
import IWETH from "../abi/IWETH.json";
import constants from '../deploy/sepolia.constants.json';

export async function weth() {
    const formattedAmount = process.argv[3];
    if (!formattedAmount) {
        throw new Error('Amount not provided via CLI.');
    }

    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);
    const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY as string,
        provider,
    );

    const weth = new ethers.Contract(constants["assets"]["weth"]["address"], IWETH, provider);
    console.log(`Depositing ${formattedAmount} WETH to ${signer.address}...`);

    const amount = ethers.utils.parseUnits(formattedAmount);
    const tx = await weth.connect(signer).deposit({ value: amount });
    await tx.wait();

    console.log(`Deposited ${formattedAmount} WETH to ${signer.address}.`);
}
