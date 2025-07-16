# AIP-2: Authority Signature Validation

- **Author**: Codi Core Team  
- **Status**: Final  
- **Created**: 2025-06-29

## Overview

This AIP defines how the Action Codes Protocol validates that action codes and transaction metas are signed by a trusted protocol authority. This ensures that codes cannot be spoofed, reused, or injected from unauthorized sources.

## Motivation

To protect users and service providers from fraudulent or tampered action codes, and to maintain a secure trust model across apps using the Action Codes Protocol. Especially when attaching action codes to transactions.

## Specification

### Requirements for Validation

1. The code or action request must be signed using a known authority’s private key.
2. The transaction must be signed by a known protocol authority (see [AIP-1](./aip-1.md)).
3. The verifier must fetch the current trusted authority list (initially from `https://relay.codi.so/.well-known/authorities`).

### Validation Steps

1. Parse the meta string from the transaction.
2. Confirm the transaction includes a signature from a trusted Action Codes authority.
3. Fetch trusted keys from `https://relay.codi.so/.well-known/authorities`.

## Notes

- Signature format and structure are defined in [AIP-0](./aip-0.md) and [AIP-1](./aip-1.md).
- Future protocol versions may allow rotating authorities or delegating issuance to wallets.

---
