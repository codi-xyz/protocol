import { sha256 } from "js-sha256";
import { CODE_LENGTH, CODE_TTL, PROTOCOL_PREFIX } from "./constants";

export class CodeGenerator {
    static TIME_WINDOW_MS = CODE_TTL;
    static CODE_DIGITS = CODE_LENGTH;

    /**
     * Get the current time slot based on timestamp
     * @param timestamp - UNIX timestamp in milliseconds (defaults to now)
     * @returns Time slot number
     */
    static getTimeSlot(timestamp: number = Date.now()): number {
        return Math.floor(timestamp / this.TIME_WINDOW_MS);
    }

    /**
     * Generate a deterministic 8-digit code based on public key, prefix, and time slot
     * @param pubkey - Solana wallet public key (base58)
     * @param prefix - Optional namespace prefix (default: "DEFAULT")
     * @param timestamp - UNIX timestamp in milliseconds (defaults to now)
     * @returns 8-digit numeric string (e.g., "12345678")
     */
    static generateCode(
        pubkey: string,
        prefix: string = "DEFAULT",
        timestamp?: number
    ): string {
        const slot = this.getTimeSlot(timestamp ?? Date.now());
        const input = `${prefix}:${pubkey}:${slot}`;
        const hash = sha256(input);

        // Take first 8 bytes (16 hex chars) for better distribution
        const raw = parseInt(hash.slice(0, 16), 16);
        const mod = 10 ** this.CODE_DIGITS; // 10^8 = 100,000,000
        const code = raw % mod;

        return code.toString().padStart(this.CODE_DIGITS, "0");
    }

    /**
     * Derive the full SHA-256 hash for storage or encryption key generation
     * @param pubkey - Solana wallet public key (base58)
     * @param prefix - Optional namespace prefix (default: "DEFAULT")
     * @param timestamp - UNIX timestamp in milliseconds (defaults to now)
     * @returns Full SHA-256 hash string
     */
    static deriveCodeHash(
        pubkey: string,
        prefix: string = "DEFAULT",
        timestamp?: number
    ): string {
        const slot = this.getTimeSlot(timestamp ?? Date.now());
        const input = `${prefix}:${pubkey}:${slot}`;
        const hash = sha256(input);
        return hash;
    }

    /**
     * Generate the message that should be signed for code verification
     * @param code - The generated 8-digit code
     * @param slot - The time slot number
     * @returns Message string in format "codi:<code>:<slot>"
     */
    static generateCodeSignatureMessage(code: string, slot: number): string {
        return `${PROTOCOL_PREFIX}:${code}:${slot}`;
    }

    /**
     * Generate the message that should be signed for code verification, from a timestamp
     * @param code - The generated 8-digit code
     * @param timestamp - UNIX timestamp in milliseconds
     * @returns Message string in format "codi:<code>:<slot>"
     */
    static generateCodeSignatureMessageFromTimestamp(code: string, timestamp: number): string {
        const slot = this.getTimeSlot(timestamp);
        return this.generateCodeSignatureMessage(code, slot);
    }

    /**
     * Get the expected code for a given public key and time slot
     * @param pubkey - Solana wallet public key (base58)
     * @param slot - Time slot number
     * @param prefix - Optional namespace prefix (default: "DEFAULT")
     * @returns 8-digit numeric string
     */
    static getExpectedCode(
        pubkey: string,
        slot: number,
        prefix: string = "DEFAULT"
    ): string {
        const timestamp = slot * this.TIME_WINDOW_MS;
        return this.generateCode(pubkey, prefix, timestamp);
    }

    /**
     * Validate if a code matches the expected code for a given public key and time slot
     * @param code - The code to validate
     * @param pubkey - Solana wallet public key (base58)
     * @param slot - Time slot number
     * @param prefix - Optional namespace prefix (default: "DEFAULT")
     * @returns True if code matches expected code
     */
    static validateCode(
        code: string,
        pubkey: string,
        slot: number,
        prefix: string = "DEFAULT"
    ): boolean {
        const expectedCode = this.getExpectedCode(pubkey, slot, prefix);
        return code === expectedCode;
    }

    /**
     * Get the time range for a given slot
     * @param slot - Time slot number
     * @returns Object with start and end timestamps
     */
    static getSlotTimeRange(slot: number): { start: number; end: number } {
        const start = slot * this.TIME_WINDOW_MS;
        const end = start + this.TIME_WINDOW_MS - 1;
        return { start, end };
    }

    /**
     * Check if a timestamp falls within a valid time window
     * @param timestamp - UNIX timestamp in milliseconds
     * @returns True if timestamp is valid
     */
    static isValidTimestamp(timestamp: number): boolean {
        return timestamp >= 0 && timestamp <= Date.now() + this.TIME_WINDOW_MS;
    }
}
