# Spool V2 Testnet: Utils

# Installation

- `npm install`
- `npm run generate-types`
- `cp .env.sample .env`
- fill in `PROVIDER` field in `.env` with the Sepolia RPC provider


## Module: Full (Sync->Flush->DoHardWork-Sync)
- Performs the full execution flow; ie. performs flush, sync and doHardWork in the right order. Following execution
of this module, all vaults specified will be flushed and synced, and all your strategies will be doHardWorked.
- The individual modules (`flush`, `sync`, `dhw`) can be executed if you need to manage an individual module, but in most cases you likely want to execute the full flow.

### Instructions
- Request strategy generation from, and give address for `DoHardWorker` role to, the Spool team
- Update `.env` with strategy addresses and `PRIVATE_KEY` for `DoHardWorker` address
- Prepare list of vaults
- `npm run full {SMART_VAULT_A} {SMART_VAULT_B}...` - for all smart vaults

## Module: DoHardWork
- Performs `DoHardWork` for strategies specified.

### Instructions
- Request strategy generation from, and give address for `DoHardWorker` role to, the Spool team
- Update `.env` with strategy addresses and `PRIVATE_KEY` for `DoHardWorker` address
- `npm run dhw`

## Module: Flush
- Performs `flush` for the vaults specified via CLI.

### Instructions
- Update `.env` with strategy addresses and `PRIVATE_KEY` of address to execute transactions
- Prepare list of vaults
- `npm run flush {SMART_VAULT_A} {SMART_VAULT_B}...` - for all smart vaults to flush

## Module: Sync
- Performs `sync` for the vaults specified via CLI.

### Instructions
- Update `.env` with strategy addresses and `PRIVATE_KEY` of address to execute transactions
- Prepare list of vaults
- `npm run sync {SMART_VAULT_A} {SMART_VAULT_B}...` - for all smart vaults to sync

## Module: Minter
- Mints 1m of each asset group token to the provided address.

### Instructions
- Update `.env` with `PRIVATE_KEY` of address to send `mint` transactions and receive minted tokens
- `npm run mint`

## Module: WETH
- Deposits provided amount of ETH to the WETH contract, mints WETH to signer. 

### Instructions
- Update `.env` with `PRIVATE_KEY` of address to send transactions and receive `weth` tokens
- `npm run weth {AMOUNT}` - where `$AMOUNT` is the amount of ETH to deposit, as a formatted string (eg. `0.01`)
- Ensure that the signer address has enough ETH to deposit, along with gas fees necessary.
