# X-Call testing scripts

This script is making a demo X-Call transaction between BSC Testnet and ETH Sepolia using a custom [text message](https://github.com/Staky-io/x-call-testing-contracts/blob/main/contracts/Messenger.sol) service.

It can eventually become the foundation for a X-Call library, to simplify the listening process of CallService and BTP events.

## Installation

Install dependencies

```bash
npm install
```

## Configuration

If needed, replace the contract addresses in `src/helpers/constants.ts` with your own.

Then, create a `.env` file with the following variable:

```bash
PRIVATE_KEY="YOUR_ETH_PRIVATE_KEY"
```

All the transaction logic is located in `src/lib/TransactionScenario.ts`.

Feel free to adapt it with your own logic !

## Usage

When everything is ready, run the following commands to execute the script and make a cross-chain transaction:

```bash
npm run build
npm run start
```