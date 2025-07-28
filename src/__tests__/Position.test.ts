import { Position } from '../models/Position';

/**
 * Position model tests
 * Tests the core chess position functionality
 */
describe('Position', () => {
  describe('constructor', () => {
    it('should create position with valid file and rank', () => {
      const position = new Position('A', 1);
      expect(position.file).toBe('A');
      expect(position.rank).toBe(1);
    });

    it('should convert lowercase file to uppercase', () => {
      const position = new Position('a', 1);
      expect(position.file).toBe('A');
    });

    it('should throw error for invalid file', () => {
      expect(() => new Position('I', 1)).toThrow('Invalid file: I. Must be A-H.');
      expect(() => new Position('Z', 1)).toThrow('Invalid file: Z. Must be A-H.');
      expect(() => new Position('', 1)).toThrow('Invalid file: . Must be A-H.');
    });

    it('should throw error for invalid rank', () => {
      expect(() => new Position('A', 0)).toThrow('Invalid rank: 0. Must be 1-8.');
      expect(() => new Position('A', 9)).toThrow('Invalid rank: 9. Must be 1-8.');
      expect(() => new Position('A', -1)).toThrow('Invalid rank: -1. Must be 1-8.');
      expect(() => new Position('A', 1.5)).toThrow('Invalid rank: 1.5. Must be 1-8.');
    });
  });

  describe('fromNotation', () => {
    it('should create position from valid notation', () => {
      const position = Position.fromNotation('A1');
      expect(position.file).toBe('A');
      expect(position.rank).toBe(1);
    });

    it('should handle lowercase notation', () => {
      const position = Position.fromNotation('h8');
      expect(position.file).toBe('H');
      expect(position.rank).toBe(8);
    });

    it('should throw error for invalid notation format', () => {
      expect(() => Position.fromNotation('A')).toThrow('Invalid notation: A. Expected format like \'A1\' or \'H8\'.');
      expect(() => Position.fromNotation('A10')).toThrow('Invalid notation: A10. Expected format like \'A1\' or \'H8\'.');
      expect(() => Position.fromNotation('')).toThrow('Invalid notation: . Expected format like \'A1\' or \'H8\'.');
    });

    it('should throw error for invalid notation values', () => {
      expect(() => Position.fromNotation('I1')).toThrow('Invalid file: I. Must be A-H.');
      expect(() => Position.fromNotation('A9')).toThrow('Invalid rank: 9. Must be 1-8.');
    });
  });

  describe('fromCoordinates', () => {
    it('should create position from valid coordinates', () => {
      const position = Position.fromCoordinates(0, 1);
      expect(position.file).toBe('A');
      expect(position.rank).toBe(1);
    });

    it('should create position from maximum coordinates', () => {
      const position = Position.fromCoordinates(7, 8);
      expect(position.file).toBe('H');
      expect(position.rank).toBe(8);
    });

    it('should throw error for invalid coordinates', () => {
      expect(() => Position.fromCoordinates(-1, 1)).toThrow('Invalid file');
      expect(() => Position.fromCoordinates(8, 1)).toThrow('Invalid file');
      expect(() => Position.fromCoordinates(0, 0)).toThrow('Invalid rank');
      expect(() => Position.fromCoordinates(0, 9)).toThrow('Invalid rank');
    });
  });

  describe('fileIndex', () => {
    it('should return correct file index', () => {
      expect(new Position('A', 1).fileIndex).toBe(0);
      expect(new Position('D', 1).fileIndex).toBe(3);
      expect(new Position('H', 1).fileIndex).toBe(7);
    });
  });

  describe('toNotation', () => {
    it('should return correct notation', () => {
      expect(new Position('A', 1).toNotation()).toBe('A1');
      expect(new Position('H', 8).toNotation()).toBe('H8');
      expect(new Position('D', 5).toNotation()).toBe('D5');
    });
  });

  describe('isValid', () => {
    it('should return true for valid positions', () => {
      expect(new Position('A', 1).isValid()).toBe(true);
      expect(new Position('H', 8).isValid()).toBe(true);
      expect(new Position('D', 5).isValid()).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for equal positions', () => {
      const pos1 = new Position('A', 1);
      const pos2 = new Position('A', 1);
      expect(pos1.equals(pos2)).toBe(true);
    });

    it('should return false for different positions', () => {
      const pos1 = new Position('A', 1);
      const pos2 = new Position('A', 2);
      const pos3 = new Position('B', 1);
      expect(pos1.equals(pos2)).toBe(false);
      expect(pos1.equals(pos3)).toBe(false);
    });
  });

  describe('offset', () => {
    it('should return new position with valid offset', () => {
      const position = new Position('D', 5);
      const newPos = position.offset(1, 1);
      expect(newPos).not.toBeNull();
      expect(newPos!.toNotation()).toBe('E6');
    });

    it('should return null for offset that goes off board', () => {
      const position = new Position('A', 1);
      expect(position.offset(-1, 0)).toBeNull();
      expect(position.offset(0, -1)).toBeNull();
      
      const edgePosition = new Position('H', 8);
      expect(edgePosition.offset(1, 0)).toBeNull();
      expect(edgePosition.offset(0, 1)).toBeNull();
    });

  });

  describe('toString', () => {
    it('should return notation string', () => {
      const position = new Position('D', 5);
      expect(position.toString()).toBe('D5');
    });
  });
});