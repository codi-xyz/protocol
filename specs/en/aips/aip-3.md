# AIP-3: Intent Resolution & Routing

- **Author**: Codi Core Team  
- **Status**: Final  
- **Created**: 2025-06-29

## Overview

This AIP defines a general-purpose system for resolving intents linked to an action code and routing them to the appropriate handling system, such as wallets, relayers, or applications. It ensures that the intent associated with a code is correctly interpreted and executed within the protocol environment.

## Motivation

To standardize how action codes translate into executable instructions in the protocol backend or compatible clients, reducing ambiguity and ensuring compatibility across integrations.

## Specification

### Intent Resolution

Each code may include metadata fields at submission time (e.g. `label`, `message`, etc.) attached by the initiator or integrating app. These metadata fields are not yet enforced or standardized by the protocol.

Currently, intents are interpreted in a flexible manner. The protocol does not yet enforce strict types like `pay`, `vote`, `mint`, etc. Instead, any valid serialized transaction or structured intent object can be used, and its meaning is inferred by the application or consumer.

Future versions may formalize intents via metadata and registered prefixes. See [AIP-5](./aip-5.md) for upcoming prefix-based routing and registry support, and [AIP-7](./aip-7.md) for cross-chain intent resolution.

### Routing

The protocol backend currently allows routing any chain transaction payload or structured intent object submitted through the action code system. There is no dedicated per-intent handler yet. Actions are resolved generically and the result of execution (or signing) is recorded in the associated task state.

In the future, standardized routing based on metadata and prefix-level registration will be introduced.

## Notes

- This AIP supports future extensions with custom intent types.
- This system allows compatibility with universal checkout, dApps, wallets, and embedded flows.
- Intent metadata is encoded in the backend and referenced during task execution.
  
---
