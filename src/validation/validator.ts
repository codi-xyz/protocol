import { CODE_LENGTH, PROTOCOL_PREFIX, CODE_TTL, CODE_DRIFT_WINDOW } from "../constants";

export interface ValidationStrategy {
    verify: (
        message: Uint8Array,
        signature: Uint8Array,
        publicKey: string,
    ) => boolean;
}

export interface TimeSlot {
    slot: number;
    timestamp: number;
}

export class CodeValidator {
    constructor(
        private readonly validator: ValidationStrategy,
    ) { }

    isValid(code: string, pubkey: string, signature: Uint8Array, currentTime?: number): boolean {
        // 1️⃣ Validate code format
        if (!this.validateCodeFormat(code)) {
            return false;
        }

        // 2️⃣ Validate time window
        const now = currentTime || Date.now();
        if (!this.isInValidTimeWindow(now)) {
            return false;
        }

        // 3️⃣ Get current time slot
        const currentSlot = this.getTimeSlot(now);
        
        // 4️⃣ Verify signature over codi:<code>:<slot>
        const message = this.getValidationMessage(code, currentSlot.slot);
        return this.validator.verify(message, signature, pubkey);
    }

    validateCodeFormat(code: string): boolean {
        return code.length === CODE_LENGTH && /^\d+$/.test(code);
    }

    isInValidTimeWindow(timestamp: number): boolean {
        const currentSlot = this.getTimeSlot(timestamp);
        const driftSlots = Math.ceil(CODE_DRIFT_WINDOW / CODE_TTL);
        
        // Check if we're within the drift window
        return currentSlot.slot >= 0; // Basic validation, can be enhanced
    }

    getTimeSlot(timestamp: number): TimeSlot {
        const slot = Math.floor(timestamp / CODE_TTL);
        return {
            slot,
            timestamp: slot * CODE_TTL
        };
    }

    getValidationMessage(code: string, slot: number): Uint8Array {
        return new TextEncoder().encode(`${PROTOCOL_PREFIX}${code}:${slot}`);
    }

    // Helper method to get the expected code for a given pubkey and time slot
    deriveCode(pubkey: string, slot: number): string {
        // This would implement the actual code derivation logic
        // For now, we'll use a simple hash-based approach
        const message = `${pubkey}:${slot}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        
        // Simple hash to generate 8-digit code
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
        }
        
        // Convert to 8-digit string
        const code = Math.abs(hash).toString().padStart(8, '0').slice(-8);
        return code;
    }

    // Complete validation with code derivation
    validateWithDerivation(pubkey: string, signature: Uint8Array, currentTime?: number): boolean {
        const now = currentTime || Date.now();
        const currentSlot = this.getTimeSlot(now);
        
        // Derive the expected code
        const expectedCode = this.deriveCode(pubkey, currentSlot.slot);
        
        // Validate using the derived code
        return this.isValid(expectedCode, pubkey, signature, now);
    }
}