[**@codi-xyz/protocol**](../../../../README.md)

***

[@codi-xyz/protocol](../../../../modules.md) / [adapters/solana/solana](../README.md) / SolanaAdapter

# Class: SolanaAdapter

Defined in: [adapters/solana/solana.ts:15](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/adapters/solana/solana.ts#L15)

Solana adapter for protocol meta using memo program
Supports both legacy and versioned transactions

## Implements

- [`ChainAdapter`](../../../../meta/interfaces/ChainAdapter.md)

## Constructors

### Constructor

> **new SolanaAdapter**(): `SolanaAdapter`

#### Returns

`SolanaAdapter`

## Methods

### decode()

> **decode**(`transaction`): `null` \| [`ProtocolMetaV1`](../../../../meta/interfaces/ProtocolMetaV1.md)

Defined in: [adapters/solana/solana.ts:33](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/adapters/solana/solana.ts#L33)

Decode protocol meta from Solana transaction (legacy or versioned)

#### Parameters

##### transaction

The Solana transaction to decode

`Transaction` | `VersionedTransaction`

#### Returns

`null` \| [`ProtocolMetaV1`](../../../../meta/interfaces/ProtocolMetaV1.md)

Decoded ProtocolMetaV1 or null if not found

#### Implementation of

[`ChainAdapter`](../../../../meta/interfaces/ChainAdapter.md).[`decode`](../../../../meta/interfaces/ChainAdapter.md#decode)

***

### encode()

> **encode**(`meta`): `TransactionInstruction`

Defined in: [adapters/solana/solana.ts:23](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/adapters/solana/solana.ts#L23)

Encode protocol meta as a Solana memo instruction

#### Parameters

##### meta

[`ProtocolMetaV1`](../../../../meta/interfaces/ProtocolMetaV1.md)

The protocol meta to encode

#### Returns

`TransactionInstruction`

TransactionInstruction for the memo

#### Implementation of

[`ChainAdapter`](../../../../meta/interfaces/ChainAdapter.md).[`encode`](../../../../meta/interfaces/ChainAdapter.md#encode)

***

### validateTransaction()

> **validateTransaction**(`transaction`, `authorities`, `expectedPrefix`): `boolean`

Defined in: [adapters/solana/solana.ts:133](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/adapters/solana/solana.ts#L133)

Validate transaction with protocol meta and authority list
Supports both legacy and versioned transactions

#### Parameters

##### transaction

The Solana transaction to validate

`Transaction` | `VersionedTransaction`

##### authorities

`string`[]

Array of valid protocol authority public keys (base58)

##### expectedPrefix

`string` = `'DEFAULT'`

Expected protocol prefix (default: 'DEFAULT')

#### Returns

`boolean`

True if transaction is valid

#### Implementation of

[`ChainAdapter`](../../../../meta/interfaces/ChainAdapter.md).[`validateTransaction`](../../../../meta/interfaces/ChainAdapter.md#validatetransaction)

***

### createTransactionWithMeta()

> `static` **createTransactionWithMeta**(`meta`, `instructions`): `Transaction`

Defined in: [adapters/solana/solana.ts:221](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/adapters/solana/solana.ts#L221)

Create a legacy transaction with protocol meta memo

#### Parameters

##### meta

[`ProtocolMetaV1`](../../../../meta/interfaces/ProtocolMetaV1.md)

The protocol meta to include

##### instructions

`TransactionInstruction`[] = `[]`

Additional transaction instructions

#### Returns

`Transaction`

Transaction with memo instruction

***

### createVersionedTransactionWithMeta()

> `static` **createVersionedTransactionWithMeta**(`meta`, `instructions`, `feePayer`): `VersionedTransaction`

Defined in: [adapters/solana/solana.ts:241](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/adapters/solana/solana.ts#L241)

Create a versioned transaction with protocol meta memo

#### Parameters

##### meta

[`ProtocolMetaV1`](../../../../meta/interfaces/ProtocolMetaV1.md)

The protocol meta to include

##### instructions

`TransactionInstruction`[] = `[]`

Additional transaction instructions

##### feePayer

`string`

The fee payer public key

#### Returns

`VersionedTransaction`

VersionedTransaction with memo instruction
