import {
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import { createMemoInstruction, MEMO_PROGRAM_ID } from '@solana/spl-memo';
import { ProtocolMetaV1, ProtocolMetaParser, ChainAdapter } from '../../meta';

/**
 * Solana adapter for protocol meta using memo program
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
     * Decode protocol meta from Solana transaction
     * @param transaction - The Solana transaction to decode
     * @returns Decoded ProtocolMetaV1 or null if not found
     */
    decode(transaction: Transaction): ProtocolMetaV1 | null {
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
     * Validate transaction with protocol meta and authority list
     * @param transaction - The Solana transaction to validate
     * @param authorities - Array of valid protocol authority public keys (base58)
     * @param expectedPrefix - Expected protocol prefix (default: 'DEFAULT')
     * @returns True if transaction is valid
     */
    validateTransaction(transaction: Transaction, authorities: string[], expectedPrefix: string = 'DEFAULT'): boolean {
        const meta = this.decode(transaction);
        if (!meta || meta.version !== '1') return false;
        if (meta.prefix !== expectedPrefix) return false;
        if (!meta.iss || !authorities.includes(meta.iss)) return false;

        // The issuer specified in meta.iss must have signed the transaction
        const issuerSigned = transaction.signatures.some(sig =>
            sig.publicKey.toBase58() === meta.iss
        );
        if (!issuerSigned) return false;

        return true;
    }

    /**
     * Create a transaction with protocol meta memo
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
} 