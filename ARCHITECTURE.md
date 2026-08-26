# NFT Collection Architecture

## Overview

This Solana program implements a complete NFT collection system following Metaplex Token Metadata standards. The architecture is designed for scalability and proper on-chain metadata management.

## Components

### 1. Collection Config (State Account)
Stores collection-level metadata and configuration.

```
CollectionConfig
├── creator: Pubkey           # Collection creator wallet
├── collection_mint: Pubkey   # Main collection mint
├── name: String              # Collection name
├── symbol: String            # Collection symbol
├── uri: String               # Collection metadata URI
└── total_supply: u64         # Total NFTs minted
```

**Seeds:** `["collection", creator_pubkey]`
**PDA Derived:** Ensures one collection per creator address

### 2. Mint Account
SPL Token mint for each NFT (0 decimals, non-fungible).

**Attributes:**
- Decimals: 0 (ensures non-fungibility)
- Authority: Program or minter
- Supply: 1 (one NFT per mint)

### 3. Metadata Account
Metaplex metadata account storing token metadata.

**Stored Data:**
- Name, symbol, URI
- Seller fee basis points
- Creator array with verification status
- Collection information
- Royalty configuration

**Derived using Metaplex standards:**
```
PDA Seeds: ["metadata", MetadataProgram, mint_pubkey]
```

### 4. Associated Token Account
Token account holding the NFT.

**Derives from:**
- Authority: NFT owner wallet
- Mint: NFT mint account
- Program: Associated Token Program

## Program Flow

### Initialization
```
User Initiates Collection
        ↓
Program Creates CollectionConfig PDA
        ↓
Creates Collection Mint (0 decimals)
        ↓
Creates Metadata Account (Metaplex)
        ↓
Collection Ready for Minting
```

### Minting
```
User Requests NFT Mint
        ↓
Program Creates New Mint
        ↓
Creates Token Account (ATA)
        ↓
Mints 1 token to ATA
        ↓
Creates Metadata Account
        ↓
Links to Collection via Metadata
        ↓
NFT Ready for Transfer/Sale
```

### Verification
```
NFT Ownership Check
        ↓
Verify Metadata Account
        ↓
Check Collection Reference
        ↓
Confirm Creator Signature
        ↓
Collection Verified ✓
```

## Account Constraints

### InitializeCollection
- **creator (Signer):** Must be transaction signer
- **collection_config (Init, PDA):** Derived from creator
- **collection_mint (Init):** Authority = collection_config
- **system_program:** Required for PDA initialization
- **token_program:** Required for mint creation

### MintNFT
- **payer (Signer & Mut):** Covers rent for new accounts
- **collection_config (Mut):** Updates total_supply
- **mint_account (Init):** New NFT mint
- **token_account (Init, ATA):** Holds the NFT
- **metadata_account (Mut, Unchecked):** Metaplex account
- **token_program:** SPL token operations

### VerifyCollection
- **creator (Signer):** Signs verification
- **collection_config (Mut):** Checked against NFT metadata
- **metadata_account (Mut):** Updated with verification

## Security Considerations

### 1. PDA Derivation
- Collection config uses `["collection", creator_pubkey]`
- Ensures creator uniqueness and prevents collisions
- Bump seed for derivation safety

### 2. Signer Requirements
- Only creator can initialize collection
- Only payer can mint (pay for accounts)
- Collection verification requires creator signature

### 3. Account Validation
- All mints created with 0 decimals
- Metadata account derived using Metaplex standards
- Creator array verification status tracked

### 4. Metadata Standards
- Follows Metaplex Token Metadata v2
- Creator royalties configurable (basis points)
- Collection linkage for proper hierarchy

## Data Flow

```
                    ┌─────────────────────┐
                    │  Collection Mint    │
                    │  (Program Authority)│
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Collection Config   │
                    │ (Creator PDA)       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼────┐    ┌─────▼──────┐   ┌────▼──────┐
        │ NFT Mint  │    │ Token Acct  │   │ Metadata  │
        │ (Init)    │    │ (ATA)       │   │ (Metaplex)│
        └───────────┘    └─────────────┘   └───────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  NFT Ready (Owner)  │
                    │  Can be sold/traded │
                    └─────────────────────┘
```

## Scalability

### Batch Minting
- Each NFT mint is independent
- Can parallelize minting operations
- Collection config only stores counter

### Future Enhancements
- Lazy collection initialization
- Whitelist/allowlist for minting
- Configurable royalties per NFT
- Freeze delegation support
- Master edition support for limited editions

## Testing Strategy

### Unit Tests
- Collection initialization
- NFT minting
- Metadata validation
- Creator verification

### Integration Tests
- Multi-NFT collection scenarios
- Cross-program interactions (Metaplex)
- Authority transitions

### Edge Cases
- Maximum supply limits
- Malformed metadata URIs
- Invalid creator signatures
- Account reinitialization attempts
