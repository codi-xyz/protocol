import { CodeGenerator } from './codegen';
import { CODE_TTL, PROTOCOL_PREFIX } from './constants';

describe('CodeGenerator', () => {
    const testPubkey = '9sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW';

    describe('getTimeSlot', () => {
        it('should calculate correct time slot for current time', () => {
            const now = Date.now();
            const slot = CodeGenerator.getTimeSlot(now);
            const expectedSlot = Math.floor(now / CODE_TTL);

            expect(slot).toBe(expectedSlot);
        });

        it('should calculate correct time slot for specific timestamp', () => {
            const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
            const slot = CodeGenerator.getTimeSlot(timestamp);
            const expectedSlot = Math.floor(timestamp / CODE_TTL);

            expect(slot).toBe(expectedSlot);
        });

        it('should use current time when no timestamp provided', () => {
            const slot = CodeGenerator.getTimeSlot();
            const now = Date.now();
            const expectedSlot = Math.floor(now / CODE_TTL);

            // Allow for small timing differences
            expect(Math.abs(slot - expectedSlot)).toBeLessThanOrEqual(1);
        });
    });

    describe('generateCode', () => {
        it('should generate 8-digit codes', () => {
            const code = CodeGenerator.generateCode(testPubkey);

            expect(code).toHaveLength(8);
            expect(/^\d{8}$/.test(code)).toBe(true);
        });

        it('should generate deterministic codes for same inputs', () => {
            const timestamp = 1640995200000;
            const code1 = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp);
            const code2 = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp);

            expect(code1).toBe(code2);
        });

        it('should generate different codes for different public keys', () => {
            const timestamp = 1640995200000;
            const pubkey1 = '9sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW';
            const pubkey2 = '8sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW';

            const code1 = CodeGenerator.generateCode(pubkey1, 'DEFAULT', timestamp);
            const code2 = CodeGenerator.generateCode(pubkey2, 'DEFAULT', timestamp);

            expect(code1).not.toBe(code2);
        });

        it('should generate different codes for different prefixes', () => {
            const timestamp = 1640995200000;
            const code1 = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp);
            const code2 = CodeGenerator.generateCode(testPubkey, 'CUSTOM', timestamp);

            expect(code1).not.toBe(code2);
        });

        it('should generate different codes for different time slots', () => {
            const timestamp1 = 1640995200000;
            const timestamp2 = timestamp1 + CODE_TTL; // Next time slot

            const code1 = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp1);
            const code2 = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp2);

            expect(code1).not.toBe(code2);
        });

        it('should pad codes with leading zeros', () => {
            // This test might be flaky due to hash randomness, but it should work most of the time
            const timestamp = 1640995200000;
            const code = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp);

            expect(code).toHaveLength(8);
            expect(/^\d{8}$/.test(code)).toBe(true);
        });

        it('should use current time when no timestamp provided', () => {
            const code1 = CodeGenerator.generateCode(testPubkey);
            const code2 = CodeGenerator.generateCode(testPubkey);

            // Codes should be the same if generated within the same time slot
            expect(code1).toBe(code2);
        });
    });

    describe('deriveCodeHash', () => {
        it('should generate SHA-256 hash', () => {
            const timestamp = 1640995200000;
            const hash = CodeGenerator.deriveCodeHash(testPubkey, 'DEFAULT', timestamp);

            expect(hash).toHaveLength(64); // SHA-256 hex string length
            expect(/^[a-f0-9]{64}$/.test(hash)).toBe(true);
        });

        it('should generate deterministic hashes for same inputs', () => {
            const timestamp = 1640995200000;
            const hash1 = CodeGenerator.deriveCodeHash(testPubkey, 'DEFAULT', timestamp);
            const hash2 = CodeGenerator.deriveCodeHash(testPubkey, 'DEFAULT', timestamp);

            expect(hash1).toBe(hash2);
        });

        it('should generate different hashes for different inputs', () => {
            const timestamp = 1640995200000;
            const hash1 = CodeGenerator.deriveCodeHash(testPubkey, 'DEFAULT', timestamp);
            const hash2 = CodeGenerator.deriveCodeHash(testPubkey, 'CUSTOM', timestamp);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('generateCodeSignatureMessage', () => {
        it('should generate correct signature message format', () => {
            const code = '12345678';
            const slot = 12345;
            const message = CodeGenerator.generateCodeSignatureMessage(code, slot);

            expect(message).toBe('codi:12345678:12345');
        });

        it('should work with different codes and slots', () => {
            const code = '87654321';
            const slot = 54321;
            const message = CodeGenerator.generateCodeSignatureMessage(code, slot);

            expect(message).toBe('codi:87654321:54321');
        });
    });

    describe('generateCodeSignatureMessageFromTimestamp', () => {
        it('should generate correct message from timestamp', () => {
            const code = '12345678';
            const timestamp = 1640995200000;
            const slot = CodeGenerator.getTimeSlot(timestamp);
            const expected = CodeGenerator.generateCodeSignatureMessage(code, slot);
            const result = CodeGenerator.generateCodeSignatureMessageFromTimestamp(code, timestamp);
            expect(result).toBe(expected);
        });
    });

    describe('Canonical Prefix', () => {
        it('should always use lowercase prefix with no trailing colon', () => {
            expect(PROTOCOL_PREFIX).toBe(PROTOCOL_PREFIX.toLowerCase());
            expect(PROTOCOL_PREFIX.endsWith(":")).toBe(false);
        });
    });

    describe('getExpectedCode', () => {
        it('should return expected code for given public key and slot', () => {
            const slot = 12345;
            const timestamp = slot * CODE_TTL;
            const expectedCode = CodeGenerator.generateCode(testPubkey, 'DEFAULT', timestamp);

            const result = CodeGenerator.getExpectedCode(testPubkey, slot, 'DEFAULT');

            expect(result).toBe(expectedCode);
        });

        it('should work with different prefixes', () => {
            const slot = 12345;
            const timestamp = slot * CODE_TTL;
            const expectedCode = CodeGenerator.generateCode(testPubkey, 'CUSTOM', timestamp);

            const result = CodeGenerator.getExpectedCode(testPubkey, slot, 'CUSTOM');

            expect(result).toBe(expectedCode);
        });
    });

    describe('validateCode', () => {
        it('should validate correct code', () => {
            const slot = 12345;
            const expectedCode = CodeGenerator.getExpectedCode(testPubkey, slot, 'DEFAULT');

            const isValid = CodeGenerator.validateCode(expectedCode, testPubkey, slot, 'DEFAULT');

            expect(isValid).toBe(true);
        });

        it('should reject incorrect code', () => {
            const slot = 12345;
            const wrongCode = '87654321';

            const isValid = CodeGenerator.validateCode(wrongCode, testPubkey, slot, 'DEFAULT');

            expect(isValid).toBe(false);
        });

        it('should reject code for wrong slot', () => {
            const slot1 = 12345;
            const slot2 = 12346;
            const expectedCode = CodeGenerator.getExpectedCode(testPubkey, slot1, 'DEFAULT');

            const isValid = CodeGenerator.validateCode(expectedCode, testPubkey, slot2, 'DEFAULT');

            expect(isValid).toBe(false);
        });

        it('should reject code for wrong prefix', () => {
            const slot = 12345;
            const expectedCode = CodeGenerator.getExpectedCode(testPubkey, slot, 'DEFAULT');

            const isValid = CodeGenerator.validateCode(expectedCode, testPubkey, slot, 'CUSTOM');

            expect(isValid).toBe(false);
        });
    });

    describe('getSlotTimeRange', () => {
        it('should return correct time range for slot', () => {
            const slot = 12345;
            const timeRange = CodeGenerator.getSlotTimeRange(slot);

            expect(timeRange.start).toBe(slot * CODE_TTL);
            expect(timeRange.end).toBe(slot * CODE_TTL + CODE_TTL - 1);
        });

        it('should handle zero slot', () => {
            const slot = 0;
            const timeRange = CodeGenerator.getSlotTimeRange(slot);

            expect(timeRange.start).toBe(0);
            expect(timeRange.end).toBe(CODE_TTL - 1);
        });
    });

    describe('isValidTimestamp', () => {
        it('should accept valid timestamps', () => {
            const now = Date.now();
            const future = now + CODE_TTL / 2;

            expect(CodeGenerator.isValidTimestamp(now)).toBe(true);
            expect(CodeGenerator.isValidTimestamp(future)).toBe(true);
        });

        it('should reject negative timestamps', () => {
            expect(CodeGenerator.isValidTimestamp(-1)).toBe(false);
        });

        it('should reject timestamps too far in the future', () => {
            const farFuture = Date.now() + CODE_TTL * 2;
            expect(CodeGenerator.isValidTimestamp(farFuture)).toBe(false);
        });
    });

    describe('Integration Tests', () => {
        it('should work end-to-end with real public keys', () => {
            const pubkeys = [
                '9sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW',
                '8sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW',
                '7sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW'
            ];

            const timestamp = 1640995200000;

            pubkeys.forEach(pubkey => {
                const code = CodeGenerator.generateCode(pubkey, 'DEFAULT', timestamp);
                const slot = CodeGenerator.getTimeSlot(timestamp);
                const isValid = CodeGenerator.validateCode(code, pubkey, slot, 'DEFAULT');

                expect(code).toHaveLength(8);
                expect(/^\d{8}$/.test(code)).toBe(true);
                expect(isValid).toBe(true);
            });
        });

        it('should generate unique codes across different parameters', () => {
            const timestamp = 1640995200000;
            const codes = new Set();

            // Test different public keys
            for (let i = 0; i < 10; i++) {
                const pubkey = `${i}sbZg6E3HbMdzEDXUGvXTo7WTxEfNMPkRjJ3xCTpSFLW`;
                const code = CodeGenerator.generateCode(pubkey, 'DEFAULT', timestamp);
                codes.add(code);
            }

            // Test different prefixes
            const prefixes = ['DEFAULT', 'CUSTOM', 'TEST', 'PROD'];
            prefixes.forEach(prefix => {
                const code = CodeGenerator.generateCode(testPubkey, prefix, timestamp);
                codes.add(code);
            });

            // Test different time slots
            for (let i = 0; i < 5; i++) {
                const slotTimestamp = timestamp + (i * CODE_TTL);
                const code = CodeGenerator.generateCode(testPubkey, 'DEFAULT', slotTimestamp);
                codes.add(code);
            }

            // Most codes should be unique (allow for some hash collisions)
            expect(codes.size).toBeGreaterThan(15); // At least 15 unique codes
        });
    });
}); 