[**@codi-xyz/protocol**](../../README.md)

***

[@codi-xyz/protocol](../../modules.md) / [validator](../README.md) / CodeValidator

# Class: CodeValidator

Defined in: [validator.ts:33](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L33)

Code validator class

## Constructors

### Constructor

> **new CodeValidator**(`validator`): `CodeValidator`

Defined in: [validator.ts:38](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L38)

Constructor

#### Parameters

##### validator

[`ValidationStrategy`](../interfaces/ValidationStrategy.md)

The validation strategy to use

#### Returns

`CodeValidator`

## Methods

### deriveCode()

> **deriveCode**(`pubkey`, `slot`, `prefix`): `string`

Defined in: [validator.ts:111](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L111)

Derive a code

#### Parameters

##### pubkey

`string`

The public key to derive the code for

##### slot

`number`

The slot to derive the code for

##### prefix

`string` = `"DEFAULT"`

The prefix to use for the code

#### Returns

`string`

The derived code

***

### getTimeSlot()

> **getTimeSlot**(`timestamp`): [`TimeSlot`](../interfaces/TimeSlot.md)

Defined in: [validator.ts:86](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L86)

Get the time slot for a timestamp

#### Parameters

##### timestamp

`number`

The timestamp to get the time slot for

#### Returns

[`TimeSlot`](../interfaces/TimeSlot.md)

The time slot

***

### getValidationMessage()

> **getValidationMessage**(`code`, `slot`): `Uint8Array`

Defined in: [validator.ts:100](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L100)

Get the validation message for a code

#### Parameters

##### code

`string`

The code to get the validation message for

##### slot

`number`

The slot to get the validation message for

#### Returns

`Uint8Array`

The validation message

***

### isValid()

> **isValid**(`code`, `pubkey`, `signature`, `currentTime?`): `boolean`

Defined in: [validator.ts:50](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L50)

Validate a code

#### Parameters

##### code

`string`

The code to validate

##### pubkey

`string`

The public key to validate against

##### signature

`Uint8Array`

The signature to validate

##### currentTime?

`number`

The current time

#### Returns

`boolean`

True if the code is valid, false otherwise

***

### validateCodeFormat()

> **validateCodeFormat**(`code`): `boolean`

Defined in: [validator.ts:77](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L77)

Validate the format of a code

#### Parameters

##### code

`string`

The code to validate

#### Returns

`boolean`

True if the code is valid, false otherwise

***

### validateWithDerivation()

> **validateWithDerivation**(`pubkey`, `signature`, `currentTime?`, `prefix?`): `boolean`

Defined in: [validator.ts:123](https://github.com/codi-xyz/protocol/blob/61f4e6c7b65c0d9d7ab439e1cd6f938b1016009d/src/validator.ts#L123)

Complete validation with code derivation

#### Parameters

##### pubkey

`string`

The public key to validate against

##### signature

`Uint8Array`

The signature to validate

##### currentTime?

`number`

The current time

##### prefix?

`string` = `"DEFAULT"`

The prefix to use for the code

#### Returns

`boolean`

True if the code is valid, false otherwise
