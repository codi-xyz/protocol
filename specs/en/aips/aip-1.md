# AIP-1: Protocol Meta Format

- **Author**: Codi Core Team  
- **Status**: Final  
- **Created**: 2025-06-29

## Overview

This AIP defines the canonical meta format used in Action Codes powered transactions. The meta string encodes authoritative metadata that allows transactions to be verified, traced, and trusted.

## Motivation

To ensure each transaction processed via Action Codes is traceable, validated, and cryptographically anchored to both an issuer and an initiator. This enables cross-system trust, analytics, and branding without compromising privacy or requiring off-chain assumptions.

## Specification

The meta format is a URL-style key-value structure prefixed by `codi:`.

### Format

```
codi:ver=1&pre=PREFIX&ini=INITIATOR[&p=PARAMS]
```

- `ver`: Protocol version (e.g. `1`)
- `pre`: Registered prefix (e.g. `DEFAULT`, or a brand-specific prefix like `JUP`)
- `iss`: Metadata issuer public key (who signed or authorized the code)
- `ini`: Initiator wallet public key (who generated the code or intent)
- `p`: Optional parameters string (used for UI hints or metadata)

### Example

```
codi:ver=1&pre=DEFAULT&ini=7gNqUuY5rWfqU6SRb3rMiD6kKMeX7jhkoXLUzbiDPKGz&p=pay-2usdc
```

## Validation

Validation requires:

1. Parsing the meta and verifying required fields (`ver`, `pre`, `ini`, `iss`, `p`)
2. Ensuring that the transaction is signed by a known Action Codes protocol authority (see [AIP-2](./aip-2.md))
3. Optionally verifying the meta initiator matches the wallet signature (in wallet UI, not required by relayers)

## Notes

- The meta is publicly visible on-chain.
- It avoids including any sensitive or encrypted data.
- This format may be extended in future protocol versions and ready to use with other blockchains.

---
