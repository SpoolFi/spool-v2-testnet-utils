require('dotenv').config();
import ISmartVaultManager from "../abi/ISmartVaultManager.json";
import contracts from '../deploy/sepolia.contracts.json';
import { ethers } from "ethers";
import { readVaults } from "./_common";

async function simulateTx(signer, smartVaultManager, vault) {
  // Prepare the transaction data using populateTransaction
  const txRequest = await smartVaultManager.populateTransaction.flushSmartVault(vault);

  console.log(`txRequest: ${JSON.stringify( txRequest )}`);
  
  // Build simulation payload
  const simulationPayload = {
    network_id: "11155111",
    from: signer,
    to: txRequest.to,
    input: txRequest.data,
    simulation_type: "full",
  };

  // Construct the Tenderly simulation API URL
  const tenderlyAccount = process.env.TENDERLY_ACCOUNT;
  const tenderlyProject = process.env.TENDERLY_PROJECT;
  const tenderlyApiKey = process.env.TENDERLY_API_KEY;
  const tenderlyUrl = `https://api.tenderly.co/api/v1/account/${tenderlyAccount}/project/${tenderlyProject}/simulate`;

  const response = await fetch(tenderlyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": tenderlyApiKey
    },
    body: JSON.stringify(simulationPayload)
  });

  const simulationResult = await response.json();
  return simulationResult;
}

export async function _flush(vaults: string[]) {
  const PROVIDER = process.env.PROVIDER;
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER);

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const smartVaultManager = new ethers.Contract(
    contracts["SmartVaultManager"]["proxy"],
    ISmartVaultManager,
    signer
  );

  for (let i = 0; i < vaults.length; i++) {
    console.log(`Flushing vault ${vaults[i]}...`);
    try {
      // Always simulate the transaction via Tenderly first
      const simulationResult = await simulateTx(signer.address, smartVaultManager, vaults[i]);
      
      const hexError = simulationResult.transaction?.transaction_info?.call_trace?.error_hex_data;
      if (hexError) {
        if (hexError.includes("eb694a3c")) {
          console.log(`Nothing to flush for vault ${vaults[i]}. continue..`);
          continue;
        } else if (hexError.includes("835fa209")) {
          console.log(`Vault ${vaults[i]} not synced. continue..`);
          continue;
        } else {
          throw new Error(`Unexpected simulation failure for vault ${vaults[i]}: ${simulationResult.simulation.error_message}`);
        }
      }
      
      // If simulation succeeded, send the actual transaction
      const tx = await smartVaultManager.flushSmartVault(vaults[i]);
      await tx.wait();
    } catch (e: any) {
      console.error(`Failed to flush vault ${vaults[i]}:`, e.message);
      throw e;
    }
  }
  console.log(`Completed stage.`);
}

export async function flush() {
  const vaults = await readVaults();
  await _flush(vaults);
}
