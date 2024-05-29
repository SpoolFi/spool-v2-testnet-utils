require('dotenv').config()

import {dhw} from "./dhw";
import {_flush} from "./flush";
import {_sync} from "./sync";
import {readVaults} from "./_common";


export async function full() {
    const vaults = await readVaults();

    // sync -> flush -> dhw -> sync, ignoring potential inital sync issues, executes the full flow. 
    console.log("Stage 1: Try sync vaults..");
    try { 
        await _sync(vaults);
    } catch (e) {
        console.log(`Error on initial vault sync: ${e}`);
    }

    console.log("Stage 2: Flush vaults..");
    try {
        await _flush(vaults);
    } catch (e) {
        if(!e.message.includes("eb694a3c")){ // NothingToFlush: continue in this case
           throw e;
        } else {
            console.log("Nothing to flush.")
        }
    }
    console.log("Stage 3: DoHardWork..");
    await dhw();

    console.log("Stage 4: Sync vaults following DHW..");
    try {
        await _sync(vaults);
    } catch (e) {
        if(!e.message.includes("cbf261db")){ // NothingToSync: No error in this case, just nothing processed.
           throw e;
        } else {
            console.log("Nothing to sync.")
        }
    }
}

