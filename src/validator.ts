import { CODE_LENGTH, CODE_TTL, MAX_DRIFT } from "./constants";
import { CodeGenerator } from "./codegen";

/**
 * Validation strategy interface
 */
export interface ValidationStrategy {
    /**
     * Verify a signature against a message
     * @param message - The message to verify
     * @param signature - The signature to verify
     * @param publicKey - The public key to verify against
     * @returns True if the signature is valid, false otherwise
     */
    verify: (
        message: Uint8Array,
        signature: Uint8Array,
        publicKey: string,
    ) => boolean;
}

/**
 * Time slot interface
 */
export interface TimeSlot {
    slot: number;
    timestamp: number;
}

/**
 * Code validator class
 */
export class CodeValidator {
    /**
     * Constructor
     * @param validator - The validation strategy to use
     */
    constructor(
        private readonly validator: ValidationStrategy,
    ) { }

    /**
     * Validate a code
     * @param code - The code to validate
     * @param pubkey - The public key to validate against
     * @param signature - The signature to validate
     * @param currentTime - The current time
     * @returns True if the code is valid, false otherwise
     */
    isValid(code: string, pubkey: string, signature: Uint8Array, currentTime?: number): boolean {
        // Validate code format
        if (!this.validateCodeFormat(code)) {
            return false;
        }

        const now = currentTime || Date.now();
        const currentSlot = this.getTimeSlot(now).slot;

        // Check ±MAX_DRIFT slots
        for (let drift = -MAX_DRIFT; drift <= MAX_DRIFT; drift++) {
            const slotToCheck = currentSlot + drift;
            if (slotToCheck < 0) continue;
            // Verify signature over codi:<code>:<slot>
            const message = this.getValidationMessage(code, slotToCheck);
            if (this.validator.verify(message, signature, pubkey)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validate the format of a code
     * @param code - The code to validate
     * @returns True if the code is valid, false otherwise
     */
    validateCodeFormat(code: string): boolean {
        return code.length === CODE_LENGTH && /^\d+$/.test(code);
    }

    /**
     * Get the time slot for a timestamp
     * @param timestamp - The timestamp to get the time slot for
     * @returns The time slot
     */
    getTimeSlot(timestamp: number): TimeSlot {
        const slot = Math.floor(timestamp / CODE_TTL);
        return {
            slot,
            timestamp: slot * CODE_TTL
        };
    }

    /**
     * Get the validation message for a code
     * @param code - The code to get the validation message for
     * @param slot - The slot to get the validation message for
     * @returns The validation message
     */
    getValidationMessage(code: string, slot: number): Uint8Array {
        return new TextEncoder().encode(CodeGenerator.generateCodeSignatureMessage(code, slot));
    }

    /**
     * Derive a code
     * @param pubkey - The public key to derive the code for
     * @param slot - The slot to derive the code for
     * @param prefix - The prefix to use for the code
     * @returns The derived code
     */
    deriveCode(pubkey: string, slot: number, prefix: string = "DEFAULT"): string {
        return CodeGenerator.getExpectedCode(pubkey, slot, prefix);
    }

    /**
     * Complete validation with code derivation
     * @param pubkey - The public key to validate against
     * @param signature - The signature to validate
     * @param currentTime - The current time
     * @param prefix - The prefix to use for the code
     * @returns True if the code is valid, false otherwise
     */
    validateWithDerivation(pubkey: string, signature: Uint8Array, currentTime?: number, prefix: string = "DEFAULT"): boolean {
        const now = currentTime || Date.now();
        const currentSlot = this.getTimeSlot(now);

        // Derive the expected code using CodeGenerator
        const expectedCode = this.deriveCode(pubkey, currentSlot.slot, prefix);

        // Validate using the derived code
        return this.isValid(expectedCode, pubkey, signature, now);
    }
}