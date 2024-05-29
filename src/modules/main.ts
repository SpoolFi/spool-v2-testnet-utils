require('dotenv').config()

import {dhw} from "./dhw";
import {_flush} from "./flush";
import {full} from "./full";
import {mint} from "./mint";
import {_sync} from "./sync";
import {readVaults} from "./_common";

async function main() {
    const requestedModuleName = process.argv[2];
    if (requestedModuleName === undefined) {
        throw new Error('Please provide a module name as an argument.');
    }
    let vaults = [];
    switch (requestedModuleName) {
        case 'dhw':
            await dhw();
            break;
        case 'flush':
            vaults = await readVaults();
            await _flush(vaults);
            break;
        case 'sync':
            vaults = await readVaults();
            await _sync(vaults);
            break;
        case 'full':
            await full();
            break;
        case 'mint':
            await mint();
            break;
        default:
            throw new Error('Invalid module name.');
    }
}
(async() => {
    await main();
})();
