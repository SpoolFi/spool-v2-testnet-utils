require("dotenv").config();
import {ethers} from "ethers";
import {IMetaVault__factory, ISpoolLens__factory} from "../contracts";
import contracts from "../deploy/sepolia.contracts.json";
import {readMetaVault} from "./_common";

export async function _mvSync(metaVault: string) {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const metaVaultContract = IMetaVault__factory.connect(metaVault, signer);

    console.log(`Syncing MetaVault ${metaVault}...`);
    try {
        const tx = await metaVaultContract.sync();
        await tx.wait();
    } catch (e) {
        const spoolLens = ISpoolLens__factory.connect(
            contracts.SpoolLens.proxy,
            signer
        );
        const completed = await spoolLens.areAllDhwRunsCompleted([metaVault]);
        if (!completed) {
            console.log(
                "DHW is not completed for underlying SmartVaults and/or Strategies"
            );
        } else {
            throw e;
        }
    }
    console.log(`Synced MetaVault`);
}

export async function mvSync() {
    const vaults = await readMetaVault();
    await _mvSync(vaults);
}
