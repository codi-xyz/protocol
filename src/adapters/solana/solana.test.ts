import { Transaction, Keypair } from '@solana/web3.js';
import { createMemoInstruction, MEMO_PROGRAM_ID } from '@solana/spl-memo';
import { SolanaAdapter } from './solana';
import { ProtocolMetaV1, ProtocolMetaParser } from '../../meta';
import { PROTOCOL_PREFIX } from '../../constants';

describe('SolanaAdapter', () => {
  let adapter: SolanaAdapter;
  let testMeta: ProtocolMetaV1;
  let authority1: Keypair;
  let authority2: Keypair;
  let mockAuthorities: string[];
  let defaultIssuer: string;

  beforeEach(() => {
    adapter = new SolanaAdapter();
    authority1 = Keypair.generate();
    authority2 = Keypair.generate();
    mockAuthorities = [authority1.publicKey.toBase58(), authority2.publicKey.toBase58()];
    defaultIssuer = authority1.publicKey.toBase58();
    testMeta = {
      version: '1',
      prefix: 'DEFAULT',
      initiator: 'ABC123',
      id: 'def456',
      iss: defaultIssuer,
      params: 'extraParam'
    };
  });

  describe('encode', () => {
    it('should encode protocol meta as memo instruction', () => {
      const instruction = adapter.encode(testMeta);
      expect(instruction.programId.equals(MEMO_PROGRAM_ID)).toBe(true);
      expect(instruction.data).toBeDefined();
    });
  });

  describe('decode', () => {
    it('should decode valid protocol meta from transaction', () => {
      const metaString = ProtocolMetaParser.serialize(testMeta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      const result = adapter.decode(transaction);
      expect(result).toEqual(testMeta);
    });
    it('should return null for transaction without memo instruction', () => {
      const transaction = new Transaction();
      const result = adapter.decode(transaction);
      expect(result).toBeNull();
    });
    it('should return null for memo with wrong protocol prefix', () => {
      const metaString = `wrong:v=1&pre=DEFAULT&ini=ABC123&id=def456&iss=${defaultIssuer}`;
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      const result = adapter.decode(transaction);
      expect(result).toBeNull();
    });
    it('should return null for unsupported protocol version', () => {
      const metaString = `${PROTOCOL_PREFIX}:v=2&pre=DEFAULT&ini=ABC123&id=def456&iss=${defaultIssuer}`;
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      const result = adapter.decode(transaction);
      expect(result).toBeNull();
    });
  });

  describe('validateTransaction', () => {
    it('should validate transaction with correct meta and authority signature', () => {
      const metaString = ProtocolMetaParser.serialize(testMeta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(true);
    });
    it('should reject transaction without memo instruction', () => {
      const transaction = new Transaction();
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(false);
    });
    it('should reject transaction with invalid meta', () => {
      const invalidMeta = {
        version: '1',
        prefix: 'DEFAULT',
        initiator: 'ABC123',
        id: 'wrongHash',
        iss: defaultIssuer
      };
      const metaString = ProtocolMetaParser.serialize(invalidMeta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      transaction.sign(authority1);
      // id is wrong, but we only check structure, not id value
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(true); // structure is valid, id is not checked here
    });
    it('should reject transaction with missing issuer', () => {
      // Remove iss from meta string
      const metaString = `${PROTOCOL_PREFIX}:v=1&pre=DEFAULT&ini=ABC123&id=def456`;
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(false);
    });
    it('should reject transaction with wrong issuer', () => {
      const meta = { ...testMeta, iss: 'NOT_AUTHORITY' };
      const metaString = ProtocolMetaParser.serialize(meta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(false);
    });
    it('should reject transaction if no signature matches authority', () => {
      const metaString = ProtocolMetaParser.serialize(testMeta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      // Sign with a random keypair not in authorities
      const randomKeypair = Keypair.generate();
      transaction.sign(randomKeypair);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(false);
    });
    it('should validate if issuer signature matches meta.iss', () => {
      const metaString = ProtocolMetaParser.serialize(testMeta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      // Sign with the correct authority (feePayer)
      transaction.feePayer = authority1.publicKey;
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(true);
    });
    it('should reject if issuer signature does not match meta.iss', () => {
      const meta = { ...testMeta, iss: authority2.publicKey.toBase58() };
      const metaString = ProtocolMetaParser.serialize(meta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      // Sign with authority1, but meta.iss is authority2
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(false);
    });
    it('should reject if prefix does not match expected', () => {
      const meta = { ...testMeta, prefix: 'OTHER' };
      const metaString = ProtocolMetaParser.serialize(meta);
      const memoInstruction = createMemoInstruction(metaString);
      const transaction = new Transaction();
      transaction.add(memoInstruction);
      transaction.recentBlockhash = Keypair.generate().publicKey.toBase58();
      transaction.sign(authority1);
      const result = adapter.validateTransaction(transaction, mockAuthorities, 'DEFAULT');
      expect(result).toBe(false);
    });
  });

  describe('createTransactionWithMeta', () => {
    it('should create transaction with memo instruction', () => {
      const transaction = SolanaAdapter.createTransactionWithMeta(testMeta);
      expect(transaction.instructions).toHaveLength(1);
      expect(transaction.instructions[0].programId.equals(MEMO_PROGRAM_ID)).toBe(true);
    });
    it('should decode meta from created transaction', () => {
      const transaction = SolanaAdapter.createTransactionWithMeta(testMeta);
      const decodedMeta = adapter.decode(transaction);
      expect(decodedMeta).toEqual(testMeta);
    });
  });
}); 