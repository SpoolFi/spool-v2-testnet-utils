require("dotenv").config();
import {ethers} from "ethers";
import {readMetaVault} from "./_common";
import {IMetaVault__factory} from "../contracts";

export async function _mvFlush(metaVault: string) {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const metaVaultContract = IMetaVault__factory.connect(metaVault, signer);

    console.log(`Flushing MetaVault ${metaVault}...`);
    try {
        const tx = await metaVaultContract.flush();
        await tx.wait();
    } catch (e) {
        if (e.message.includes("7c63f042")) {
            console.log(`MetaVault should be reallocated first`);
        } else if (e.message.includes("07c4fbc1")) {
            console.log("MetaVault should be synced first");
        } else {
            throw e;
        }
    }
    console.log(`Flushed MetaVault`);
}

export async function mvFlush() {
    const vaults = await readMetaVault();
    await _mvFlush(vaults);
}
