[**@codi-xyz/protocol**](../../README.md)

***

[@codi-xyz/protocol](../../modules.md) / [meta](../README.md) / ChainAdapter

# Interface: ChainAdapter

Defined in: [meta.ts:118](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/meta.ts#L118)

Base adapter interface for chain-specific implementations

## Methods

### decode()

> **decode**(`data`): `null` \| [`ProtocolMetaV1`](ProtocolMetaV1.md)

Defined in: [meta.ts:131](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/meta.ts#L131)

Decode protocol meta from chain-specific data

#### Parameters

##### data

`any`

Chain-specific data to decode

#### Returns

`null` \| [`ProtocolMetaV1`](ProtocolMetaV1.md)

Decoded ProtocolMeta or null if invalid

***

### encode()

> **encode**(`meta`): `any`

Defined in: [meta.ts:124](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/meta.ts#L124)

Encode protocol meta for the specific chain

#### Parameters

##### meta

[`ProtocolMetaV1`](ProtocolMetaV1.md)

The protocol meta to encode

#### Returns

`any`

Chain-specific encoded data

***

### validateTransaction()

> **validateTransaction**(`transaction`, `authorities?`, `expectedPrefix?`): `boolean`

Defined in: [meta.ts:140](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/meta.ts#L140)

Validate transaction with protocol meta

#### Parameters

##### transaction

`any`

The transaction to validate

##### authorities?

`string`[]

Optional array of valid protocol authority public keys (base58)

##### expectedPrefix?

`string`

Optional expected protocol prefix

#### Returns

`boolean`

True if transaction is valid
