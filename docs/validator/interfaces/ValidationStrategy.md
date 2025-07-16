[**@codi-xyz/protocol**](../../README.md)

***

[@codi-xyz/protocol](../../modules.md) / [validator](../README.md) / ValidationStrategy

# Interface: ValidationStrategy

Defined in: [validator.ts:7](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/validator.ts#L7)

Validation strategy interface

## Properties

### verify()

> **verify**: (`message`, `signature`, `publicKey`) => `boolean`

Defined in: [validator.ts:15](https://github.com/codi-xyz/protocol/blob/7dd35660b72e021f0aea9ce5abeac1856fc6b63b/src/validator.ts#L15)

Verify a signature against a message

#### Parameters

##### message

`Uint8Array`

The message to verify

##### signature

`Uint8Array`

The signature to verify

##### publicKey

`string`

The public key to verify against

#### Returns

`boolean`

True if the signature is valid, false otherwise
