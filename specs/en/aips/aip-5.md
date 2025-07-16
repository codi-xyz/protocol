# AIP-5: On-chain Trust System

- **Author**: Codi Core Team  
- **Status**: Draft  
- **Created**: 2025-06-29

## Overview

This AIP defines a proposed system for establishing and verifying trust in action code participants (issuers, initiators, recipients) using on-chain mechanisms. It complements the [Prefix System](./aip-4.md) by anchoring identity and authority in verifiable on-chain data.

## Motivation

To prevent phishing, spoofing, or misuse of prefixes and authorities, it is critical to provide a decentralized, on-chain trust layer. This enables wallets, dApps, and users to programmatically assess whether an action code comes from a verified source.

## Specification

### Trust Anchors

Each registered prefix or protocol authority may publish its metadata and trust credentials on-chain. These include:

- Public authority key (for signature validation)
- ENS name, DNSSEC-verified domain, or SPL name service record
- Optional verification record: hash of off-chain branding or UI schema

### Validation Flow

When resolving a code or protocol meta:
1. Extract the `iss` (issuer) and `pre` (prefix) from the protocol meta.
2. Fetch the prefix registry entry (see [AIP-4](./aip-4.md)).
3. Retrieve associated on-chain trust anchors.
4. Validate:
   - Signature from `iss` matches authority key in registry (see [AIP-2](./aip-2.md))
   - Registry data is anchored in verifiable on-chain record (e.g. SPL domain, name registry)
   - [Optional] Additional trust score or external verification

### Trust Consumer

Wallets, dApps, and payment providers may implement:
- Green checkmarks or trust icons
- Warning banners for unknown prefixes
- Filtering logic based on known verified participants

### Extensibility

- Could support reputation scoring or staking-based verification later
- May evolve to include zk-verified off-chain attestations

## Notes

- This AIP builds on [AIP-1](./aip-1.md) (memo format) and [AIP-4](./aip-4.md) (prefix system)
- This system aims to be decentralized and opt-in but strongly recommended for user-facing apps

---
