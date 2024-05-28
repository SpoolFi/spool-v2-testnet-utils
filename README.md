# Spool V2 Testnet: Utils

# Installation

- `npm install`
- `cp .env.sample .env`
- fill in `PROVIDER` field in `.env` with the Sepolia RPC provider

## Module: DoHardWork
- Performs `DoHardWork` for strategies specified.

### Instructions
- Request strategy generation from, and give address for `DoHardWorker` role to, the Spool team
- Update `.env` with strategy addresses and `PRIVATE_KEY` for `DoHardWorker` address
- `npm run dhw`

## Module: Minter
- Mints 1m of each asset group token to the provided address.

### Instructions
- Update `.env` with `PRIVATE_KEY` of address to send `mint` transactions and receive minted tokens
- `npm run mint`
