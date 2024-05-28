require('dotenv').config();
import { BigNumber, ethers } from 'ethers';
import IERC20Mintable from "../../abi/IERC20Mintable.json";
import constants from '../../deploy/sepolia.constants.json';

export async function mint() {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);
    const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY as string,
        provider,
    );

    const tokens = [
        new ethers.Contract(constants["assets"]["dai"]["address"], IERC20Mintable, provider),
        new ethers.Contract(constants["assets"]["usdc"]["address"], IERC20Mintable, provider),
        new ethers.Contract(constants["assets"]["usdt"]["address"], IERC20Mintable, provider),
    ];

    for (const token of tokens) {
        const decimals = await token.decimals();
        const amount = BigNumber.from(10).pow(decimals).mul(1_000_000);
        const tx = await token.connect(signer).mint(signer.address, amount);
        await tx.wait();
        console.log(`Minted 1m ${await token.symbol()} to ${signer.address}.`);
    }
}
mint();
