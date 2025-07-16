[**@codi-xyz/protocol**](../../README.md)

***

[@codi-xyz/protocol](../../modules.md) / [codegen](../README.md) / CodeGenerator

# Class: CodeGenerator

Defined in: [codegen.ts:4](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L4)

## Constructors

### Constructor

> **new CodeGenerator**(): `CodeGenerator`

#### Returns

`CodeGenerator`

## Properties

### CODE\_DIGITS

> `static` **CODE\_DIGITS**: `number` = `CODE_LENGTH`

Defined in: [codegen.ts:6](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L6)

***

### TIME\_WINDOW\_MS

> `static` **TIME\_WINDOW\_MS**: `number` = `CODE_TTL`

Defined in: [codegen.ts:5](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L5)

## Methods

### deriveCodeHash()

> `static` **deriveCodeHash**(`pubkey`, `prefix`, `timestamp?`): `string`

Defined in: [codegen.ts:48](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L48)

Derive the full SHA-256 hash for storage or encryption key generation

#### Parameters

##### pubkey

`string`

Solana wallet public key (base58)

##### prefix

`string` = `"DEFAULT"`

Optional namespace prefix (default: "DEFAULT")

##### timestamp?

`number`

UNIX timestamp in milliseconds (defaults to now)

#### Returns

`string`

Full SHA-256 hash string

***

### generateCode()

> `static` **generateCode**(`pubkey`, `prefix`, `timestamp?`): `string`

Defined in: [codegen.ts:24](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L24)

Generate a deterministic 8-digit code based on public key, prefix, and time slot

#### Parameters

##### pubkey

`string`

Solana wallet public key (base58)

##### prefix

`string` = `"DEFAULT"`

Optional namespace prefix (default: "DEFAULT")

##### timestamp?

`number`

UNIX timestamp in milliseconds (defaults to now)

#### Returns

`string`

8-digit numeric string (e.g., "12345678")

***

### generateCodeSignatureMessage()

> `static` **generateCodeSignatureMessage**(`code`, `slot`): `string`

Defined in: [codegen.ts:65](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L65)

Generate the message that should be signed for code verification

#### Parameters

##### code

`string`

The generated 8-digit code

##### slot

`number`

The time slot number

#### Returns

`string`

Message string in format "codi:<code>:<slot>"

***

### generateCodeSignatureMessageFromTimestamp()

> `static` **generateCodeSignatureMessageFromTimestamp**(`code`, `timestamp`): `string`

Defined in: [codegen.ts:75](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L75)

Generate the message that should be signed for code verification from timestamp

#### Parameters

##### code

`string`

The generated 8-digit code

##### timestamp

`number`

UNIX timestamp in milliseconds

#### Returns

`string`

Message string in format "codi:<code>:<slot>"

***

### getExpectedCode()

> `static` **getExpectedCode**(`pubkey`, `slot`, `prefix`): `string`

Defined in: [codegen.ts:87](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L87)

Get the expected code for a given public key and time slot

#### Parameters

##### pubkey

`string`

Solana wallet public key (base58)

##### slot

`number`

Time slot number

##### prefix

`string` = `"DEFAULT"`

Optional namespace prefix (default: "DEFAULT")

#### Returns

`string`

8-digit numeric string

***

### getSlotTimeRange()

> `static` **getSlotTimeRange**(`slot`): `object`

Defined in: [codegen.ts:119](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L119)

Get the time range for a given slot

#### Parameters

##### slot

`number`

Time slot number

#### Returns

`object`

Object with start and end timestamps

##### end

> **end**: `number`

##### start

> **start**: `number`

***

### getTimeSlot()

> `static` **getTimeSlot**(`timestamp`): `number`

Defined in: [codegen.ts:13](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L13)

Get the current time slot based on timestamp

#### Parameters

##### timestamp

`number` = `...`

UNIX timestamp in milliseconds (defaults to now)

#### Returns

`number`

Time slot number

***

### isValidTimestamp()

> `static` **isValidTimestamp**(`timestamp`): `boolean`

Defined in: [codegen.ts:130](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L130)

Check if a timestamp falls within a valid time window

#### Parameters

##### timestamp

`number`

UNIX timestamp in milliseconds

#### Returns

`boolean`

True if timestamp is valid

***

### validateCode()

> `static` **validateCode**(`code`, `pubkey`, `slot`, `prefix`): `boolean`

Defined in: [codegen.ts:104](https://github.com/codi-xyz/protocol/blob/002e813eac9470bcfdb2a1790ddea7c341cb39dd/src/codegen.ts#L104)

Validate if a code matches the expected code for a given public key and time slot

#### Parameters

##### code

`string`

The code to validate

##### pubkey

`string`

Solana wallet public key (base58)

##### slot

`number`

Time slot number

##### prefix

`string` = `"DEFAULT"`

Optional namespace prefix (default: "DEFAULT")

#### Returns

`boolean`

True if code matches expected code
