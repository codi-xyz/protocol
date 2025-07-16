[**@codi-xyz/protocol**](../../README.md)

***

[@codi-xyz/protocol](../../modules.md) / [meta](../README.md) / ProtocolMetaParser

# Class: ProtocolMetaParser

Defined in: [meta.ts:19](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/meta.ts#L19)

Protocol meta parser for structured memo/message parsing

## Constructors

### Constructor

> **new ProtocolMetaParser**(): `ProtocolMetaParser`

#### Returns

`ProtocolMetaParser`

## Methods

### fromInitiator()

> `static` **fromInitiator**(`initiator`, `iss`, `prefix`, `params?`): [`ProtocolMetaV1`](../interfaces/ProtocolMetaV1.md)

Defined in: [meta.ts:73](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/meta.ts#L73)

Create protocol meta from code and parameters

#### Parameters

##### initiator

`string`

The initiator public key

##### iss

`string`

The issuer (protocol authority)

##### prefix

`string` = `"DEFAULT"`

The prefix (default: "DEFAULT")

##### params?

`string`

Optional parameters

#### Returns

[`ProtocolMetaV1`](../interfaces/ProtocolMetaV1.md)

ProtocolMeta object

***

### parse()

> `static` **parse**(`metaString`): `null` \| [`ProtocolMetaV1`](../interfaces/ProtocolMetaV1.md)

Defined in: [meta.ts:27](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/meta.ts#L27)

Parse protocol meta from string

#### Parameters

##### metaString

`string`

The protocol meta string to parse

#### Returns

`null` \| [`ProtocolMetaV1`](../interfaces/ProtocolMetaV1.md)

Parsed ProtocolMeta object or null if invalid

***

### serialize()

> `static` **serialize**(`meta`): `string`

Defined in: [meta.ts:55](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/meta.ts#L55)

Serialize ProtocolMeta to string

#### Parameters

##### meta

[`ProtocolMetaV1`](../interfaces/ProtocolMetaV1.md)

The protocol meta to serialize

#### Returns

`string`

Serialized protocol meta string

***

### validateCode()

> `static` **validateCode**(`meta`): `boolean`

Defined in: [meta.ts:96](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/meta.ts#L96)

Validate if a code matches the protocol meta

#### Parameters

##### meta

[`ProtocolMetaV1`](../interfaces/ProtocolMetaV1.md)

The protocol meta to validate against

#### Returns

`boolean`

True if the meta is valid

***

### validateMetaFromString()

> `static` **validateMetaFromString**(`metaString`): `boolean`

Defined in: [meta.ts:106](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/meta.ts#L106)

Validate if a code matches the protocol meta by parsing from string

#### Parameters

##### metaString

`string`

The protocol meta string to validate against

#### Returns

`boolean`

True if the code matches the meta
