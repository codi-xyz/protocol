import nacl from "tweetnacl";
import { PublicKey } from '@solana/web3.js'
import type { ValidationStrategy } from '../../validator'

export const SolanaCodeValidator: ValidationStrategy = {
    verify(message, signature, publicKey) {
        try {
            const publicKeyBytes = new PublicKey(publicKey).toBytes();

            return nacl.sign.detached.verify(
                message,
                signature,
                publicKeyBytes
            );
        } catch {
            return false;
        }
    },
}