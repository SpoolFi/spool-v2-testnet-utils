# Spool V2 Testnet: Utils

# Installation

- `npm install`
- `cp .env.sample .env`
- fill in `PROVIDER` field in `.env` with the Sepolia RPC provider

## Module: DoHardWork
- Performs DoHardWork for strategies specified.
- Request strategy generation from, and give address for `DoHardWorker` role to, the Spool team
- Update `.env` with strategy addresses and `PRIVATE_KEY` for `DoHardWorker` address
- `npm run dhw`

## Module: Minter
- Mints 1m of each asset group token to the provided address.
- Update `.env` with user address to receive minted tokens, and RPC provider for Sepolia
- `npm run mint`
