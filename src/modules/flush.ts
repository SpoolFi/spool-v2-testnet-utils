require('dotenv').config()
import ISmartVaultManager from "../abi/ISmartVaultManager.json";
import contracts from '../deploy/sepolia.contracts.json';
import { ethers } from "ethers";
import {readVaults} from "./_common";

export async function _flush(vaults: string[]) {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const smartVaultManager = new ethers.Contract(
        contracts["SmartVaultManager"]["proxy"], ISmartVaultManager, signer
    );
    
    for (let i = 0; i < vaults.length; i++) {
        console.log(`Flushing vault ${vaults[i]}...`);
        const tx = await smartVaultManager.flushSmartVault(vaults[i]);
        await tx.wait();
    }
    console.log(`Flushed vaults.`);
}

export async function flush() {
    const vaults = await readVaults();
    await _flush(vaults);
}
