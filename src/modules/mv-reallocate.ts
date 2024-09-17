require("dotenv").config();
import {ethers} from "ethers";
import {readMetaVault} from "./_common";
import {IMetaVault__factory} from "../contracts";

export async function _mvReallocate(metaVault: string) {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const metaVaultContract = IMetaVault__factory.connect(metaVault, signer);

    console.log(`Reallocating MetaVault ${metaVault}...`);
    const vaults = await metaVaultContract.getSmartVaults();
    try {
        const tx = await metaVaultContract.reallocate(vaults.map((v) => [[]]));
        await tx.wait();
    } catch (e) {
        if (e.message.includes("07c4fbc1")) {
            console.log("MetaVault should be synced first");
        } else {
            throw e;
        }
    }
    console.log(`Reallocated MetaVault`);
}

export async function mvReallocate() {
    const metaVault = await readMetaVault();
    await _mvReallocate(metaVault);
}
