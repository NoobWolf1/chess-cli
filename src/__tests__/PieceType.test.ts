import { PieceType, PieceTypeUtils } from '../models/PieceType';

/**
 * PieceType and PieceTypeUtils tests
 * Tests piece type enumeration and utility functions
 */
describe('PieceType', () => {
  describe('enum values', () => {
    it('should have correct enum values', () => {
      expect(PieceType.PAWN).toBe('Pawn');
      expect(PieceType.KING).toBe('King');
      expect(PieceType.QUEEN).toBe('Queen');
    });
  });
});

describe('PieceTypeUtils', () => {
  describe('fromString', () => {
    it('should convert valid piece strings to enum', () => {
      expect(PieceTypeUtils.fromString('Pawn')).toBe(PieceType.PAWN);
      expect(PieceTypeUtils.fromString('King')).toBe(PieceType.KING);
      expect(PieceTypeUtils.fromString('Queen')).toBe(PieceType.QUEEN);
    });

    it('should handle case-insensitive input', () => {
      expect(PieceTypeUtils.fromString('pawn')).toBe(PieceType.PAWN);
      expect(PieceTypeUtils.fromString('KING')).toBe(PieceType.KING);
      expect(PieceTypeUtils.fromString('queen')).toBe(PieceType.QUEEN);
      expect(PieceTypeUtils.fromString('PaWn')).toBe(PieceType.PAWN);
    });

    it('should trim whitespace', () => {
      expect(PieceTypeUtils.fromString(' Pawn ')).toBe(PieceType.PAWN);
      expect(PieceTypeUtils.fromString('\tKing\n')).toBe(PieceType.KING);
    });

    it('should throw error for invalid piece types', () => {
      expect(() => PieceTypeUtils.fromString('Rook')).toThrow('Unsupported piece type: Rook. Supported types: Pawn, King, Queen');
      expect(() => PieceTypeUtils.fromString('Bishop')).toThrow('Unsupported piece type: Bishop. Supported types: Pawn, King, Queen');
      expect(() => PieceTypeUtils.fromString('Knight')).toThrow('Unsupported piece type: Knight. Supported types: Pawn, King, Queen');
      expect(() => PieceTypeUtils.fromString('')).toThrow('Unsupported piece type: . Supported types: Pawn, King, Queen');
      expect(() => PieceTypeUtils.fromString('Invalid')).toThrow('Unsupported piece type: Invalid. Supported types: Pawn, King, Queen');
    });
  });

  describe('isValid', () => {
    it('should return true for valid piece types', () => {
      expect(PieceTypeUtils.isValid('Pawn')).toBe(true);
      expect(PieceTypeUtils.isValid('King')).toBe(true);
      expect(PieceTypeUtils.isValid('Queen')).toBe(true);
      expect(PieceTypeUtils.isValid('pawn')).toBe(true);
      expect(PieceTypeUtils.isValid('KING')).toBe(true);
    });

    it('should return false for invalid piece types', () => {
      expect(PieceTypeUtils.isValid('Rook')).toBe(false);
      expect(PieceTypeUtils.isValid('Bishop')).toBe(false);
      expect(PieceTypeUtils.isValid('Knight')).toBe(false);
      expect(PieceTypeUtils.isValid('')).toBe(false);
      expect(PieceTypeUtils.isValid('Invalid')).toBe(false);
    });
  });

  describe('getAllTypes', () => {
    it('should return all supported piece types', () => {
      const allTypes = PieceTypeUtils.getAllTypes();
      expect(allTypes).toContain(PieceType.PAWN);
      expect(allTypes).toContain(PieceType.KING);
      expect(allTypes).toContain(PieceType.QUEEN);
      expect(allTypes).toHaveLength(3);
    });

    it('should return a new array each call', () => {
      const types1 = PieceTypeUtils.getAllTypes();
      const types2 = PieceTypeUtils.getAllTypes();
      expect(types1).not.toBe(types2); // Different array instances
      expect(types1).toEqual(types2); // Same content
    });
  });
});