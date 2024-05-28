require('dotenv').config();
import { BigNumber, ethers } from 'ethers';
import IStrategyRegistry from "../../abi/IStrategyRegistry.json";
import contracts from '../../deploy/sepolia.contracts.json';
import constants from '../../deploy/sepolia.constants.json';
import {chainlinkOnChainExchangeRates} from './helpers/ExchangeRates';

type SwapInfo = {
    swapTarget: string;
    token: string;
    swapCallData: string;
};

type DhwParameters = {
    strategies: string[][];
    swapInfo: SwapInfo[][][];
    compoundSwapInfo: SwapInfo[][][];
    strategySlippages: BigNumber[][][];
    baseYields: BigNumber[][];
    tokens: string[];
    exchangeRateSlippages: [BigNumber, BigNumber][];
    validUntil: BigNumber;
};

export async function executeDhw() {
    const PROVIDER = process.env.PROVIDER;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

    const strategyRegistry = new ethers.Contract(
        contracts["StrategyRegistry"]["proxy"], IStrategyRegistry, provider
    );

    const strategies = [
        [ process.env.MOCK_DAI ],
        [ process.env.MOCK_USDC ],
        [ process.env.MOCK_USDT ],
        [ process.env.MOCK_WETH ],
    ]

    const swapInfo = [ [ [] ], [ [] ], [ [] ], [ [] ] ];
    const compoundSwapInfo = [ [ [] ], [ [] ], [ [] ], [ [] ] ];
    const strategySlippages = [ [ [] ], [ [] ], [ [] ], [ [] ] ];
    const baseYields = [[], [], [], []];

    const tokens = [
        constants["assets"]["dai"]["address"],
        constants["assets"]["usdc"]["address"],
        constants["assets"]["usdt"]["address"],
        constants["assets"]["weth"]["address"]
    ]
    
    const exchangeRateSlippages = await chainlinkOnChainExchangeRates(tokens, provider);

    const block = await provider.getBlockNumber();
    const blockTimestamp = (await provider.getBlock(block)).timestamp;
    const validFor = BigNumber.from(Math.ceil(Date.now() / 1000 + 94670777));
    const validUntil = BigNumber.from(blockTimestamp).add(validFor);

    const dhwParams: DhwParameters = {
        strategies: strategies,
        swapInfo: swapInfo,
        compoundSwapInfo: compoundSwapInfo,
        strategySlippages: strategySlippages,
        baseYields: baseYields,
        tokens: tokens,
        exchangeRateSlippages: exchangeRateSlippages,
        validUntil: validUntil
    };
    
    console.log('DHW Parameters:', JSON.stringify( dhwParams ));

    const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY as string,
        provider,
    );
    console.log('Executing DHW...');
    const tx = await strategyRegistry.connect(signer).doHardWork(dhwParams, {
        gasLimit: 5_000_000,
    });
    await tx.wait();

    console.log('DHW executed successfully.');
}
executeDhw();
