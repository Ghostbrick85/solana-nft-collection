# Ghostbrick85 Urban Underground Genesis — X Layer

A fixed collection of 10 ERC-721 NFTs for X Layer. The contract includes owner-controlled minting, a hard supply cap, ERC-2981 royalty signaling, enumerable ownership, pausing, and IPFS metadata.

## Network

| Network | Chain ID | Gas | RPC |
|---|---:|---|---|
| X Layer Testnet | 1952 | Test OKB | `https://testrpc.xlayer.tech/terigon` |
| X Layer Mainnet | 196 | OKB | `https://rpc.xlayer.tech` |

## Prepare metadata

1. Upload `assets/images` to IPFS as one folder.
2. Replace `REPLACE_IMAGE_CID` in `metadata/1.json` through `metadata/10.json`.
3. Upload the completed `metadata` folder to IPFS.
4. Copy `.env.example` to `.env` and set `BASE_TOKEN_URI=ipfs://<metadata-CID>/`.

Never commit `.env`, a seed phrase, or a private key.

## Test

```bash
npm install
npm test
```

## Deploy safely

Deploy to testnet first:

```bash
npm run deploy:testnet
```

After checking the contract and metadata on the X Layer testnet explorer, deploy to mainnet:

```bash
npm run deploy:mainnet
```

Mint all ten NFTs to the owner after deployment with `mint(ownerAddress, 10)`. ERC-2981 communicates royalty terms, but individual marketplaces decide whether to honor them.
