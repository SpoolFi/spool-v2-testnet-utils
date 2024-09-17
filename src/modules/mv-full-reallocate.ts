require("dotenv").config();

import {ethers} from "ethers";
import {IMetaVault__factory} from "../contracts";
import {readMetaVault} from "./_common";
import {fullSmartVaults} from "./full";
import {_mvReallocate} from "./mv-reallocate";
import {_mvReallocateSync} from "./mv-reallocate-sync";

export async function mvFullReallocate() {
    const metaVault = await readMetaVault();

    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
    const metaVaultContract = IMetaVault__factory.connect(metaVault, provider);
    const vaults = await metaVaultContract.getSmartVaults();

    console.log("MV Stage 1: Reallocating...");
    await _mvReallocate(metaVault);

    await fullSmartVaults(vaults);

    console.log("MV Stage 2: Sync reallocation...");
    await _mvReallocateSync(metaVault);
}
