require("dotenv").config();

import {ethers} from "ethers";
import {IMetaVault__factory} from "../contracts";
import {readMetaVault} from "./_common";
import {fullSmartVaults} from "./full";
import {_mvFlush} from "./mv-flush";
import {_mvSync} from "./mv-sync";

export async function mvFull() {
    const metaVault = await readMetaVault();

    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
    const metaVaultContract = IMetaVault__factory.connect(metaVault, provider);
    const vaults = await metaVaultContract.getSmartVaults();

    console.log("MV Stage 1: Flushing...");
    await _mvFlush(metaVault);

    await fullSmartVaults(vaults);

    console.log("MV Stage 2: Syncing...");
    await _mvSync(metaVault);
}
