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
        try {
            const tx = await smartVaultManager.flushSmartVault(vaults[i]);
            await tx.wait();
        } catch (e) {
            if (e.message.includes("eb694a3c")) {
                console.log(`Nothing to flush for vault ${vaults[i]}`);
            } else if(e.message.includes("835fa209")) {
                console.log("vault not synced..");
            }
        }
    }
    console.log(`Flushed vaults.`);
}

export async function flush() {
    const vaults = await readVaults();
    await _flush(vaults);
}
