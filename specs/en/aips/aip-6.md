# AIP-6: Cross-chain Protocol Compatibility

- **Author**: Codi Core Team  
- **Status**: Draft  
- **Created**: 2025-06-29

## Overview

This AIP explores the strategy and requirements to extend Action Codes’ protocol architecture to support multiple blockchains beyond Solana, starting with EVM-based chains. The goal is to maintain the simplicity of one-time action codes while enabling broad composability and adoption.

## Motivation

While the initial version of Action Codes is designed for Solana, many merchants, wallets, and dApps operate across chains. Cross-chain compatibility ensures the protocol can serve the broader ecosystem and become the de facto checkout and action intent layer.

## Design Considerations

- Preserve code format and protocol meta philosophy
- Provide unified SDK interface regardless of chain
- Support chain-specific transaction encoding and submission
- Use chain ID or namespace for routing

## Specification

### Universal Code Format

Action codes remain chain-agnostic (e.g. `JUP-99283234`), but underlying resolution uses:

- `chain` field in code metadata or SDK input
- Chain ID embedded in future protocol meta formats (optional extension to AIP-1)

### SDK Support

The SDK will abstract:

- Transaction preparation and signing per chain
- Action code resolution with metadata routing
- Signature or transaction handling logic

Initial support targets:

- Solana (native)
- EVM (Ethereum, Polygon, Base, etc.)
- Others (Cosmos, etc.)

### Memo Compatibility

While not all chains support native protocol meta fields, Action Codes will:

- Embed metadata in standard fields (e.g. calldata, input, logs)
- Support L2 resolvers or off-chain relay systems for tracking

### Security and Trust

Cross-chain actions must still validate:

- Issuer authority (on-chain or via gateway)
- Code authenticity and expiration
- Intent match (if applicable)

The existing [AIP-2](./aip-2.md) and [AIP-5](./aip-5.md) principles still apply across chains.

## Migration

A migration strategy will be provided once the adapter for the target chain is implemented, including examples and documentation.

## Notes

- This AIP enables multi-chain merchant support and future wallet integrations
- Chain-specific components may be implemented as plugins or submodules

---

