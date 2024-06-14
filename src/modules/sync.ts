require('dotenv').config()
import ISmartVaultManager from "../abi/ISmartVaultManager.json";
import contracts from '../deploy/sepolia.contracts.json';
import { ethers } from "ethers";
import {readVaults} from "./_common";

export async function _sync(vaults: string[]) {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const smartVaultManager = new ethers.Contract(
        contracts["SmartVaultManager"]["proxy"], ISmartVaultManager, signer
    );
    
    console.log(`Syncing vaults: ${vaults}`);
    for (let i = 0; i < vaults.length; i++) {
        console.log(`Syncing vault ${vaults[i]}...`);
        try {
            const tx = await smartVaultManager.syncSmartVault(vaults[i], true);
            await tx.wait();
        } catch (e) {
            if (e.message.includes("cbf261db")) {
                console.log(`Nothing to sync for vault ${vaults[i]}`);
            } else if(e.message.includes("751077a3")) {
                console.log(`DHW not run yet for index..`);
            } else {
                throw e;
            }
        }
    }
    console.log(`Synced vaults.`);
}

export async function sync() {
    const vaults = await readVaults();
    await _sync(vaults);
}
