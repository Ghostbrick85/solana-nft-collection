# X Layer NFT Architecture

The collection uses the EVM-native ERC-721 standard on X Layer instead of Solana SPL tokens and Metaplex.

## Components

- `Ghostbrick85Genesis.sol`: fixed 10-token ERC-721 contract.
- `assets/images`: normalized PNG artwork (`nft-001.png` through `nft-010.png`).
- `metadata`: ERC-721 JSON metadata stored on IPFS.
- `scripts/deploy.js`: guarded X Layer deployment script.
- `test`: contract behavior and supply-cap tests.

## Security and ownership

- Only the owner can mint, pause, change the base URI, or change royalty settings.
- Supply cannot exceed ten NFTs.
- Royalties cannot be configured above 10%.
- No withdrawal function or sale proceeds are held by the contract.
- The deployer should transfer ownership to a hardware-wallet or multisig after launch if appropriate.

## Launch flow

Images → IPFS image CID → metadata JSON update → IPFS metadata CID → testnet deploy → mint and verify → mainnet deploy → mint collection.
