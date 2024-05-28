import { BigNumber, ethers } from 'ethers';
import IERC20 from "../../../abi/IERC20.json";
import IPriceFeedManager from "../../../abi/IPriceFeedManager.json";
import contracts from '../../../deploy/sepolia.contracts.json';

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
