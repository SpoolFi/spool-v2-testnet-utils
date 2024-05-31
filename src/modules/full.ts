require('dotenv').config()

import {dhw} from "./dhw";
import {_flush} from "./flush";
import {_sync} from "./sync";
import {readVaults} from "./_common";

export async function full() {
    const vaults = await readVaults();

    // sync -> flush -> dhw -> sync, ignoring potential inital sync issues, executes the full flow. 
    console.log("Stage 1: Sync vaults..");
    await _sync(vaults);

    console.log("Stage 2: Flush vaults..");
    await _flush(vaults);

    console.log("Stage 3: DoHardWork..");
    await dhw();

    console.log("Stage 4: Sync vaults following DHW..");
    await _sync(vaults);
}

