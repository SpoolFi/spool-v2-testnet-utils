require('dotenv').config()

import {dhw} from "./dhw";
import {_flush} from "./flush";
import {full} from "./full";
import {mint} from "./mint";
import {_sync} from "./sync";
import {weth} from "./weth";
import {readVaults} from "./_common";
import { mvFlush } from './mv-flush';
import { mvSync } from './mv-sync';
import { mvReallocate } from './mv-reallocate';
import { mvReallocateSync } from './mv-reallocate-sync';
import { mvFull } from './mv-full';
import { mvFullReallocate } from './mv-full-reallocate';

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
        case 'weth':
            await weth();
            break;
        case 'mv-flush':
            await mvFlush();
            break;
        case 'mv-sync':
            await mvSync();
            break;
        case 'mv-reallocate':
            await mvReallocate();
            break;
        case 'mv-reallocate-sync':
            await mvReallocateSync();
            break;
        case 'mv-full':
            await mvFull();
            break;
        case 'mv-full-reallocate':
            await mvFullReallocate();
            break;
        default:
            throw new Error('Invalid module name.');
    }
}
(async() => {
    await main();
})();
