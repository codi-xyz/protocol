import { SolanaCodeValidator } from './validator';
import { CodeValidator } from '../../validator';
import { PROTOCOL_PREFIX, CODE_TTL } from '../../constants';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import { CodeGenerator } from '../../codegen';

describe('SolanaCodeValidator', () => {
    let keypair: Keypair;
    let validator: CodeValidator;

    beforeEach(() => {
        keypair = Keypair.generate();
        validator = new CodeValidator(SolanaCodeValidator);
    });

    describe('verify', () => {
        it('should verify a valid signature', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            const result = SolanaCodeValidator.verify(
                message,
                signature,
                keypair.publicKey.toString()
            );

            expect(result).toBe(true);
        });

        it('should reject an invalid signature', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const wrongKeypair = Keypair.generate();
            const wrongSignature = nacl.sign.detached(message, wrongKeypair.secretKey);

            const result = SolanaCodeValidator.verify(
                message,
                wrongSignature,
                keypair.publicKey.toString()
            );

            expect(result).toBe(false);
        });

        it('should reject a tampered message', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            // Tamper with the message
            const tamperedMessage = new TextEncoder().encode(`${PROTOCOL_PREFIX}${code}:${slot + 1}`);

            const result = SolanaCodeValidator.verify(
                tamperedMessage,
                signature,
                keypair.publicKey.toString()
            );

            expect(result).toBe(false);
        });

        it('should handle invalid public key format', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            const result = SolanaCodeValidator.verify(
                message,
                signature,
                'invalid-public-key'
            );

            expect(result).toBe(false);
        });

        it('should handle empty message', () => {
            const message = new Uint8Array(0);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            const result = SolanaCodeValidator.verify(
                message,
                signature,
                keypair.publicKey.toString()
            );

            expect(result).toBe(true);
        });

        it('should handle empty signature', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const emptySignature = new Uint8Array(0);

            const result = SolanaCodeValidator.verify(
                message,
                emptySignature,
                keypair.publicKey.toString()
            );

            expect(result).toBe(false);
        });

        it('should handle signature with wrong length', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const wrongLengthSignature = new Uint8Array(32); // Wrong length

            const result = SolanaCodeValidator.verify(
                message,
                wrongLengthSignature,
                keypair.publicKey.toString()
            );

            expect(result).toBe(false);
        });

        it('should handle malformed public key bytes', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            // Create a malformed public key string
            const malformedPubkey = 'not-a-valid-base58-string';

            const result = SolanaCodeValidator.verify(
                message,
                signature,
                malformedPubkey
            );

            expect(result).toBe(false);
        });

        it('should handle null/undefined inputs gracefully', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            // Test with undefined public key
            const result = SolanaCodeValidator.verify(
                message,
                signature,
                undefined as any
            );

            expect(result).toBe(false);
        });
    });
});

describe('CodeValidator with Solana', () => {
    let keypair: Keypair;
    let validator: CodeValidator;

    beforeEach(() => {
        keypair = Keypair.generate();
        validator = new CodeValidator(SolanaCodeValidator);
    });

    describe('isValid', () => {
        it('should validate a correct 8-digit code with valid signature and time slot', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000; // Within the time slot

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(true);
        });

        it('should reject a code with invalid signature', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const wrongKeypair = Keypair.generate();
            const wrongSignature = nacl.sign.detached(message, wrongKeypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), wrongSignature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject when code is modified', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid('87654321', keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should handle empty code', () => {
            const code = '';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes with non-digit characters', () => {
            const code = '1234567a'; // 8 characters but contains letter
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes with special characters', () => {
            const code = '1234567@'; // 8 characters but contains special char
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes with unicode characters', () => {
            const code = '1234567🚀'; // 8 characters but contains unicode
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes that are too short', () => {
            const code = '1234567'; // 7 digits, should be 8
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes that are too long', () => {
            const code = '1'.repeat(10); // 10 digits, should be 8
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should accept exactly 8-digit codes', () => {
            const codes = ['00000000', '12345678', '99999999', '11111111', '22222222'];
            const slot = 12345;
            const currentTime = slot * CODE_TTL + 1000;

            codes.forEach(code => {
                const message = validator.getValidationMessage(code, slot);
                const signature = nacl.sign.detached(message, keypair.secretKey);

                const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

                expect(result).toBe(true);
            });
        });

        it('should handle invalid public key format', () => {
            const code = '12345678';
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, 'invalid-public-key', signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject numeric codes that are too long', () => {
            const code = '123456789'; // 9 digits, should be 8
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes with spaces', () => {
            const code = '123456 7'; // 8 characters but contains space
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });

        it('should reject codes with newlines', () => {
            const code = '1234567\n'; // 8 characters but contains newline
            const slot = 12345;
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);
            const currentTime = slot * CODE_TTL + 1000;

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(false);
        });
    });

    describe('validateWithDerivation', () => {
        it('should validate with derived code', () => {
            const slot = 12345;
            const currentTime = slot * CODE_TTL + 1000;

            // Derive the expected code
            const expectedCode = validator.deriveCode(keypair.publicKey.toString(), slot);

            // Create signature for the derived code using the correct message format
            const message = CodeGenerator.generateCodeSignatureMessage(expectedCode, slot);
            const signature = nacl.sign.detached(new TextEncoder().encode(message), keypair.secretKey);

            const result = validator.validateWithDerivation(keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(true);
        });

        it('should reject with wrong signature for derived code', () => {
            const slot = 12345;
            const currentTime = slot * CODE_TTL + 1000;

            // Use wrong keypair for signature
            const wrongKeypair = Keypair.generate();
            const expectedCode = validator.deriveCode(keypair.publicKey.toString(), slot);
            const message = new TextEncoder().encode(`${PROTOCOL_PREFIX}${expectedCode}:${slot}`);
            const wrongSignature = nacl.sign.detached(message, wrongKeypair.secretKey);

            const result = validator.validateWithDerivation(keypair.publicKey.toString(), wrongSignature, currentTime);

            expect(result).toBe(false);
        });
    });

    describe('Drift Window', () => {
        it('should accept code/signature from previous slot if within MAX_DRIFT', () => {
            const slot = 12345;
            const prevSlot = slot - 1;
            const currentTime = slot * CODE_TTL + 1000;
            const code = validator.deriveCode(keypair.publicKey.toString(), prevSlot);
            const message = CodeGenerator.generateCodeSignatureMessage(code, prevSlot);
            const signature = nacl.sign.detached(new TextEncoder().encode(message), keypair.secretKey);
            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);
            expect(result).toBe(true);
        });
        it('should accept code/signature from next slot if within MAX_DRIFT', () => {
            const slot = 12345;
            const nextSlot = slot + 1;
            const currentTime = slot * CODE_TTL + 1000;
            const code = validator.deriveCode(keypair.publicKey.toString(), nextSlot);
            const message = CodeGenerator.generateCodeSignatureMessage(code, nextSlot);
            const signature = nacl.sign.detached(new TextEncoder().encode(message), keypair.secretKey);
            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);
            expect(result).toBe(true);
        });
        it('should reject code/signature from slot outside MAX_DRIFT', () => {
            const slot = 12345;
            const farSlot = slot + 2; // MAX_DRIFT is 1
            const currentTime = slot * CODE_TTL + 1000;
            const code = validator.deriveCode(keypair.publicKey.toString(), farSlot);
            const message = CodeGenerator.generateCodeSignatureMessage(code, farSlot);
            const signature = nacl.sign.detached(new TextEncoder().encode(message), keypair.secretKey);
            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);
            expect(result).toBe(false);
        });
    });
});

describe('Integration Tests', () => {
    let keypair: Keypair;
    let validator: CodeValidator;

    beforeEach(() => {
        keypair = Keypair.generate();
        validator = new CodeValidator(SolanaCodeValidator);
    });

    it('should work with numeric code examples', () => {
        const testCases = [
            '12345678',
            '00000000',
            '99999999',
            '12345678',
            '65432100',
            '11111111',
            '22222222',
            '33333333',
            '44444444',
            '55555555'
        ];
        const slot = 12345;
        const currentTime = slot * CODE_TTL + 1000;

        testCases.forEach(code => {
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(true);
        });
    });

    it('should handle multiple validations with same keypair', () => {
        const codes = ['11111111', '22222222', '33333333', '44444444', '55555555'];
        const slot = 12345;
        const currentTime = slot * CODE_TTL + 1000;

        codes.forEach(code => {
            const message = validator.getValidationMessage(code, slot);
            const signature = nacl.sign.detached(message, keypair.secretKey);

            const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

            expect(result).toBe(true);
        });
    });

    it('should reject cross-contamination between different codes', () => {
        const code1 = '11111111';
        const code2 = '22222222';
        const slot = 12345;
        const currentTime = slot * CODE_TTL + 1000;

        const message1 = new TextEncoder().encode(`${PROTOCOL_PREFIX}${code1}:${slot}`);
        const signature1 = nacl.sign.detached(message1, keypair.secretKey);

        // Try to use signature from code1 with code2
        const result = validator.isValid(code2, keypair.publicKey.toString(), signature1, currentTime);

        expect(result).toBe(false);
    });

    it('should handle protocol prefix correctly', () => {
        const code = '12345678';
        const slot = 12345;
        const message = validator.getValidationMessage(code, slot);
        const signature = nacl.sign.detached(message, keypair.secretKey);
        const currentTime = slot * CODE_TTL + 1000;

        // Verify the message includes the protocol prefix and slot
        expect(message).toEqual(new TextEncoder().encode('codi:12345678:12345'));

        const result = validator.isValid(code, keypair.publicKey.toString(), signature, currentTime);

        expect(result).toBe(true);
    });
});
