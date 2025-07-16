[**@codi-xyz/protocol**](../../../../README.md)

***

[@codi-xyz/protocol](../../../../modules.md) / [adapters/solana/solana](../README.md) / SolanaAdapter

# Class: SolanaAdapter

Defined in: [adapters/solana/solana.ts:11](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/adapters/solana/solana.ts#L11)

Solana adapter for protocol meta using memo program

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

Defined in: [adapters/solana/solana.ts:29](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/adapters/solana/solana.ts#L29)

Decode protocol meta from Solana transaction

#### Parameters

##### transaction

`Transaction`

The Solana transaction to decode

#### Returns

`null` \| [`ProtocolMetaV1`](../../../../meta/interfaces/ProtocolMetaV1.md)

Decoded ProtocolMetaV1 or null if not found

#### Implementation of

[`ChainAdapter`](../../../../meta/interfaces/ChainAdapter.md).[`decode`](../../../../meta/interfaces/ChainAdapter.md#decode)

***

### encode()

> **encode**(`meta`): `TransactionInstruction`

Defined in: [adapters/solana/solana.ts:19](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/adapters/solana/solana.ts#L19)

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

Defined in: [adapters/solana/solana.ts:62](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/adapters/solana/solana.ts#L62)

Validate transaction with protocol meta and authority list

#### Parameters

##### transaction

`Transaction`

The Solana transaction to validate

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

Defined in: [adapters/solana/solana.ts:83](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/adapters/solana/solana.ts#L83)

Create a transaction with protocol meta memo

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
