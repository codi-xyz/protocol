[**@codi-xyz/protocol**](../../README.md)

***

[@codi-xyz/protocol](../../modules.md) / [validator](../README.md) / ValidationStrategy

# Interface: ValidationStrategy

Defined in: [validator.ts:7](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L7)

Validation strategy interface

## Properties

### verify()

> **verify**: (`message`, `signature`, `publicKey`) => `boolean`

Defined in: [validator.ts:15](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L15)

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
