import { BigNumber, ethers } from 'ethers';
import IERC20 from "../abi/IERC20.json";
import IPriceFeedManager from "../abi/IPriceFeedManager.json";
import contracts from '../deploy/sepolia.contracts.json';

export async function readVaults() : Promise<string[]> {
    let vaults : string[] = [];
    // read vaults from process.argv
    for (let i = 3; i < process.argv.length; i++) {
        vaults.push(process.argv[i]);
    }
    if (vaults.length == 0) {
        throw new Error("Error: No vaults addresses received.");
    }

    return vaults;
}

export async function readMetaVault() : Promise<string> {
    if (process.argv[3] === undefined) {
        throw new Error("Error: No MetaVault address received.");

    }
    return process.argv[3];
}

export async function chainlinkOnChainExchangeRates(
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider
): Promise<[BigNumber, BigNumber][]> {
    const priceFeedManager = new ethers.Contract(
        contracts["UsdPriceFeedManager"]["proxy"], IPriceFeedManager, provider
    );

    const exchangeRateSlippages: [BigNumber, BigNumber][] = [];

    for (const tokenAddress of tokens) {
        const token = new ethers.Contract(tokenAddress, IERC20, provider);
        const decimals = await token.decimals();
        const unit = BigNumber.from(10).pow(decimals);

        const price = await priceFeedManager.assetToUsd(tokenAddress, unit);

        exchangeRateSlippages.push([
            price.mul(999).div(1000), // exchange-rate-slippage-tolerance
            price.mul(1001).div(1000),
        ]);
    }

    return exchangeRateSlippages;
}
