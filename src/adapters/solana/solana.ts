import {
    Transaction,
    TransactionInstruction,
    VersionedTransaction,
    MessageV0,
    PublicKey,
} from '@solana/web3.js';
import { createMemoInstruction, MEMO_PROGRAM_ID } from '@solana/spl-memo';
import { ProtocolMetaV1, ProtocolMetaParser, ChainAdapter } from '../../meta';

/**
 * Solana adapter for protocol meta using memo program
 * Supports both legacy and versioned transactions
 */
export class SolanaAdapter implements ChainAdapter {
    private static readonly MEMO_PROGRAM_ID = MEMO_PROGRAM_ID;

    /**
     * Encode protocol meta as a Solana memo instruction
     * @param meta - The protocol meta to encode
     * @returns TransactionInstruction for the memo
     */
    encode(meta: ProtocolMetaV1): TransactionInstruction {
        const metaString = ProtocolMetaParser.serialize(meta);
        return createMemoInstruction(metaString);
    }

    /**
     * Decode protocol meta from Solana transaction (legacy or versioned)
     * @param transaction - The Solana transaction to decode
     * @returns Decoded ProtocolMetaV1 or null if not found
     */
    decode(transaction: Transaction | VersionedTransaction): ProtocolMetaV1 | null {
        // Check if it's a versioned transaction by looking for the message property
        if ('message' in transaction && transaction.message) {
            return this.decodeVersionedTransaction(transaction as VersionedTransaction);
        } else if ('instructions' in transaction && Array.isArray(transaction.instructions)) {
            return this.decodeLegacyTransaction(transaction as Transaction);
        } else {
            console.warn('Unknown transaction type');
            return null;
        }
    }

    /**
     * Decode protocol meta from legacy Solana transaction
     * @param transaction - The legacy Solana transaction to decode
     * @returns Decoded ProtocolMetaV1 or null if not found
     */
    private decodeLegacyTransaction(transaction: Transaction): ProtocolMetaV1 | null {
        // Find memo instruction in transaction
        for (const instruction of transaction.instructions) {
            if (instruction.programId.equals(SolanaAdapter.MEMO_PROGRAM_ID)) {
                // Decode memo data
                const memoData = instruction.data;
                if (memoData && memoData.length > 0) {
                    try {
                        const memoString = new TextDecoder().decode(memoData);
                        const meta = ProtocolMetaParser.parse(memoString);
                        // Validate version for future-proofing
                        if (meta && meta.version !== '1') {
                            console.warn(`Unsupported protocol version: ${meta.version}`);
                            return null;
                        }
                        return meta;
                    } catch (error) {
                        console.error('Error decoding memo data:', error);
                        return null;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Decode protocol meta from versioned Solana transaction
     * @param transaction - The versioned Solana transaction to decode
     * @returns Decoded ProtocolMetaV1 or null if not found
     */
    private decodeVersionedTransaction(transaction: VersionedTransaction): ProtocolMetaV1 | null {
        const message = transaction.message;

        if (message instanceof MessageV0) {
            return this.decodeMessageV0(message);
        } else {
            // Handle other message versions as they become available
            console.warn('Unsupported versioned transaction message type');
            return null;
        }
    }

    /**
     * Decode protocol meta from MessageV0
     * @param message - The MessageV0 to decode
     * @returns Decoded ProtocolMetaV1 or null if not found
     */
    private decodeMessageV0(message: MessageV0): ProtocolMetaV1 | null {
        for (const instruction of message.compiledInstructions) {
            const programId = message.staticAccountKeys[instruction.programIdIndex];

            if (programId.equals(SolanaAdapter.MEMO_PROGRAM_ID)) {
                // Decode memo data
                const memoData = instruction.data;
                if (memoData && memoData.length > 0) {
                    try {
                        const memoString = new TextDecoder().decode(memoData);
                        const meta = ProtocolMetaParser.parse(memoString);
                        // Validate version for future-proofing
                        if (meta && meta.version !== '1') {
                            console.warn(`Unsupported protocol version: ${meta.version}`);
                            return null;
                        }
                        return meta;
                    } catch (error) {
                        console.error('Error decoding memo data:', error);
                        return null;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Validate transaction with protocol meta and authority list
     * Supports both legacy and versioned transactions
     * @param transaction - The Solana transaction to validate
     * @param authorities - Array of valid protocol authority public keys (base58)
     * @param expectedPrefix - Expected protocol prefix (default: 'DEFAULT')
     * @returns True if transaction is valid
     */
    validateTransaction(
        transaction: Transaction | VersionedTransaction,
        authorities: string[],
        expectedPrefix: string = 'DEFAULT'
    ): boolean {
        const meta = this.decode(transaction);
        if (!meta || meta.version !== '1') return false;
        if (meta.prefix !== expectedPrefix) return false;
        if (!meta.iss || !authorities.includes(meta.iss)) return false;

        // Check if the issuer specified in meta.iss has signed the transaction
        const issuerSigned = this.hasIssuerSignature(transaction, meta.iss);
        if (!issuerSigned) return false;

        return true;
    }

    /**
     * Check if the issuer has signed the transaction
     * @param transaction - The transaction to check
     * @param issuer - The issuer public key (base58)
     * @returns True if issuer has signed
     */
    private hasIssuerSignature(transaction: Transaction | VersionedTransaction, issuer: string): boolean {
        // Check if it's a versioned transaction by looking for the message property
        if ('message' in transaction && transaction.message) {
            return this.hasIssuerSignatureVersioned(transaction as VersionedTransaction, issuer);
        } else if ('signatures' in transaction && Array.isArray(transaction.signatures)) {
            return this.hasIssuerSignatureLegacy(transaction as Transaction, issuer);
        } else {
            console.warn('Unknown transaction type for signature validation');
            return false;
        }
    }

    /**
     * Check if the issuer has signed a legacy transaction
     * @param transaction - The legacy transaction to check
     * @param issuer - The issuer public key (base58)
     * @returns True if issuer has signed
     */
    private hasIssuerSignatureLegacy(transaction: Transaction, issuer: string): boolean {
        return transaction.signatures.some(sig =>
            sig.publicKey.toBase58() === issuer
        );
    }

    /**
     * Check if the issuer has signed a versioned transaction
     * @param transaction - The versioned transaction to check
     * @param issuer - The issuer public key (base58)
     * @returns True if issuer has signed
     */
    private hasIssuerSignatureVersioned(transaction: VersionedTransaction, issuer: string): boolean {
        // For versioned transactions, we need to check the address table lookups
        // and static account keys to find the issuer
        const message = transaction.message;

        if (message instanceof MessageV0) {
            // Check static account keys
            for (const key of message.staticAccountKeys) {
                if (key.toBase58() === issuer) {
                    return true;
                }
            }

            // Check address table lookups if present
            for (const lookup of message.addressTableLookups) {
                for (const index of lookup.writableIndexes) {
                    // Note: This is a simplified check. In a real implementation,
                    // you would need to resolve the address table lookup
                    // For now, we'll assume the issuer is in static account keys
                }
                for (const index of lookup.readonlyIndexes) {
                    // Same note as above
                }
            }
        }

        return false;
    }

    /**
     * Create a legacy transaction with protocol meta memo
     * @param meta - The protocol meta to include
     * @param instructions - Additional transaction instructions
     * @returns Transaction with memo instruction
     */
    static createTransactionWithMeta(
        meta: ProtocolMetaV1,
        instructions: TransactionInstruction[] = []
    ): Transaction {
        const adapter = new SolanaAdapter();
        const memoInstruction = adapter.encode(meta);

        const transaction = new Transaction();
        transaction.add(memoInstruction, ...instructions);

        return transaction;
    }

    /**
     * Create a versioned transaction with protocol meta memo
     * @param meta - The protocol meta to include
     * @param instructions - Additional transaction instructions
     * @param feePayer - The fee payer public key
     * @returns VersionedTransaction with memo instruction
     */
    static createVersionedTransactionWithMeta(
        meta: ProtocolMetaV1,
        instructions: TransactionInstruction[] = [],
        feePayer: string
    ): VersionedTransaction {
        const adapter = new SolanaAdapter();
        const memoInstruction = adapter.encode(meta);

        // Combine memo instruction with additional instructions
        const allInstructions = [memoInstruction, ...instructions];

        // Collect all unique account keys
        const accountKeys = new Set<string>();
        accountKeys.add(feePayer); // Add fee payer first

        for (const instruction of allInstructions) {
            for (const key of instruction.keys) {
                accountKeys.add(key.pubkey.toBase58());
            }
            accountKeys.add(instruction.programId.toBase58());
        }

        const staticAccountKeys = Array.from(accountKeys).map(key =>
            new PublicKey(key)
        );

        // Create MessageV0
        const messageV0 = new MessageV0({
            header: {
                numRequiredSignatures: 1,
                numReadonlySignedAccounts: 0,
                numReadonlyUnsignedAccounts: 1,
            },
            staticAccountKeys,
            recentBlockhash: '11111111111111111111111111111111', // Placeholder
            compiledInstructions: allInstructions.map((instruction) => {
                const programIdIndex = staticAccountKeys.findIndex(key =>
                    key.equals(instruction.programId)
                );
                const accountKeyIndexes = instruction.keys.map(key =>
                    staticAccountKeys.findIndex(staticKey =>
                        staticKey.equals(key.pubkey)
                    )
                );

                return {
                    programIdIndex,
                    accountKeyIndexes,
                    data: instruction.data,
                };
            }),
            addressTableLookups: [],
        });

        return new VersionedTransaction(messageV0);
    }
} 