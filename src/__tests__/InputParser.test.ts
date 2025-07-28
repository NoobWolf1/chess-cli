import { InputParser } from '../utils/InputParser';
import { PieceType } from '../models/PieceType';

/**
 * InputParser tests
 * Tests command line argument and string parsing functionality
 */
describe('InputParser', () => {
  describe('parseArgs', () => {
    it('should parse valid arguments correctly', () => {
      const args = ['King', 'D5'];
      const result = InputParser.parseArgs(args);
      
      expect(result.pieceType).toBe(PieceType.KING);
      expect(result.position.toNotation()).toBe('D5');
    });

    it('should handle all supported piece types', () => {
      const testCases = [
        { args: ['Pawn', 'G1'], expectedType: PieceType.PAWN },
        { args: ['King', 'D5'], expectedType: PieceType.KING },
        { args: ['Queen', 'E4'], expectedType: PieceType.QUEEN }
      ];

      testCases.forEach(({ args, expectedType }) => {
        const result = InputParser.parseArgs(args);
        expect(result.pieceType).toBe(expectedType);
      });
    });

    it('should handle case-insensitive piece types', () => {
      const testCases = [
        ['pawn', 'A1'],
        ['KING', 'D5'],
        ['queen', 'E4'],
        ['King', 'H8'],
        ['PaWn', 'B2']
      ];

      testCases.forEach(args => {
        expect(() => InputParser.parseArgs(args)).not.toThrow();
      });
    });

    it('should handle case-insensitive positions', () => {
      const testCases = [
        ['King', 'a1'],
        ['Queen', 'h8'],
        ['Pawn', 'd5']
      ];

      testCases.forEach(args => {
        const result = InputParser.parseArgs(args);
        expect(result.position.file).toMatch(/^[A-H]$/);
      });
    });

    it('should throw error for invalid number of arguments', () => {
      expect(() => InputParser.parseArgs([])).toThrow('No arguments provided. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseArgs(['King'])).toThrow('Invalid number of arguments: 1. Expected: 2. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseArgs(['King', 'D5', 'Extra'])).toThrow('Invalid number of arguments: 3. Expected: 2. Usage: <PieceType> <Position>');
    });

    it('should throw error for empty arguments', () => {
      expect(() => InputParser.parseArgs(['', 'D5'])).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseArgs(['King', ''])).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseArgs(['', ''])).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseArgs([' ', 'D5'])).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
    });

    it('should throw error for invalid piece types', () => {
      expect(() => InputParser.parseArgs(['Rook', 'D5'])).toThrow('Invalid input: Unsupported piece type: Rook. Supported types: Pawn, King, Queen');
      expect(() => InputParser.parseArgs(['Bishop', 'D5'])).toThrow('Invalid input: Unsupported piece type: Bishop. Supported types: Pawn, King, Queen');
      expect(() => InputParser.parseArgs(['Knight', 'D5'])).toThrow('Invalid input: Unsupported piece type: Knight. Supported types: Pawn, King, Queen');
      expect(() => InputParser.parseArgs(['InvalidPiece', 'D5'])).toThrow('Invalid input: Unsupported piece type: InvalidPiece. Supported types: Pawn, King, Queen');
    });

    it('should throw error for invalid positions', () => {
      expect(() => InputParser.parseArgs(['King', 'I5'])).toThrow('Invalid input: Invalid file: I. Must be A-H.');
      expect(() => InputParser.parseArgs(['King', 'D0'])).toThrow('Invalid input: Invalid rank: 0. Must be 1-8.');
      expect(() => InputParser.parseArgs(['King', 'D9'])).toThrow('Invalid input: Invalid rank: 9. Must be 1-8.');
      expect(() => InputParser.parseArgs(['King', 'DD'])).toThrow('Invalid input: Invalid rank: NaN. Must be 1-8.');
      expect(() => InputParser.parseArgs(['King', 'D'])).toThrow('Invalid input: Invalid notation: D. Expected format like \'A1\' or \'H8\'.');
      expect(() => InputParser.parseArgs(['King', 'D55'])).toThrow('Invalid input: Invalid notation: D55. Expected format like \'A1\' or \'H8\'.');
    });

    it('should handle null and undefined arguments', () => {
      expect(() => InputParser.parseArgs(null as any)).toThrow('No arguments provided. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseArgs(undefined as any)).toThrow('No arguments provided. Usage: <PieceType> <Position>');
    });
  });

  describe('parseString', () => {
    it('should parse valid comma-separated string', () => {
      const input = 'King, D5';
      const result = InputParser.parseString(input);
      
      expect(result.pieceType).toBe(PieceType.KING);
      expect(result.position.toNotation()).toBe('D5');
    });

    it('should handle whitespace around commas', () => {
      const testCases = [
        'King,D5',
        'King, D5',
        'King ,D5',
        'King , D5',
        '  King  ,  D5  ',
        '\tKing\t,\tD5\t'
      ];

      testCases.forEach(input => {
        const result = InputParser.parseString(input);
        expect(result.pieceType).toBe(PieceType.KING);
        expect(result.position.toNotation()).toBe('D5');
      });
    });

    it('should handle all piece types in string format', () => {
      const testCases = [
        { input: 'Pawn, G1', expectedType: PieceType.PAWN, expectedPos: 'G1' },
        { input: 'King, D5', expectedType: PieceType.KING, expectedPos: 'D5' },
        { input: 'Queen, E4', expectedType: PieceType.QUEEN, expectedPos: 'E4' }
      ];

      testCases.forEach(({ input, expectedType, expectedPos }) => {
        const result = InputParser.parseString(input);
        expect(result.pieceType).toBe(expectedType);
        expect(result.position.toNotation()).toBe(expectedPos);
      });
    });

    it('should throw error for invalid string format', () => {
      expect(() => InputParser.parseString('')).toThrow('Input must be a non-empty string');
      expect(() => InputParser.parseString('King')).toThrow('Invalid input format: "King". Expected format: "PieceType, Position"');
      expect(() => InputParser.parseString('King,D5,Extra')).toThrow('Invalid input format: "King,D5,Extra". Expected format: "PieceType, Position"');
      expect(() => InputParser.parseString('King D5')).toThrow('Invalid input format: "King D5". Expected format: "PieceType, Position"');
    });

    it('should throw error for non-string input', () => {
      expect(() => InputParser.parseString(null as any)).toThrow('Input must be a non-empty string');
      expect(() => InputParser.parseString(undefined as any)).toThrow('Input must be a non-empty string');
      expect(() => InputParser.parseString(123 as any)).toThrow('Input must be a non-empty string');
      expect(() => InputParser.parseString({} as any)).toThrow('Input must be a non-empty string');
    });

    it('should handle strings with empty parts', () => {
      expect(() => InputParser.parseString(', D5')).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseString('King, ')).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
      expect(() => InputParser.parseString(' , ')).toThrow('Arguments cannot be empty. Usage: <PieceType> <Position>');
    });
  });

  describe('getUsageHelp', () => {
    it('should return comprehensive help message', () => {
      const help = InputParser.getUsageHelp();
      
      expect(help).toContain('Usage: npm start <PieceType> <Position>');
      expect(help).toContain('Pawn');
      expect(help).toContain('King');
      expect(help).toContain('Queen');
      expect(help).toContain('Examples:');
      expect(help).toContain('npm start King D5');
      expect(help).toContain('npm start Queen E4');
      expect(help).toContain('npm start Pawn G1');
    });

    it('should include all supported piece types', () => {
      const help = InputParser.getUsageHelp();
      
      // Should mention all supported piece types
      expect(help).toContain('Pawn');
      expect(help).toContain('King');
      expect(help).toContain('Queen');
    });

    it('should provide clear format examples', () => {
      const help = InputParser.getUsageHelp();
      
      expect(help).toContain('A1');
      expect(help).toContain('H8');
      expect(help).toContain('D5');
      expect(help).toContain('E4');
      expect(help).toContain('G1');
    });
  });

  describe('integration tests', () => {
    it('should handle real command line scenarios', () => {
      // Simulate actual command line usage
      const scenarios = [
        { args: ['King', 'D5'], expected: { type: PieceType.KING, pos: 'D5' } },
        { args: ['queen', 'e4'], expected: { type: PieceType.QUEEN, pos: 'E4' } },
        { args: ['PAWN', 'g1'], expected: { type: PieceType.PAWN, pos: 'G1' } }
      ];

      scenarios.forEach(({ args, expected }) => {
        const result = InputParser.parseArgs(args);
        expect(result.pieceType).toBe(expected.type);
        expect(result.position.toNotation()).toBe(expected.pos);
      });
    });

    it('should be consistent between parseArgs and parseString', () => {
      const testCases = [
        { args: ['King', 'D5'], str: 'King, D5' },
        { args: ['Pawn', 'G1'], str: 'Pawn, G1' },
        { args: ['Queen', 'E4'], str: 'Queen, E4' }
      ];

      testCases.forEach(({ args, str }) => {
        const argsResult = InputParser.parseArgs(args);
        const stringResult = InputParser.parseString(str);
        
        expect(argsResult.pieceType).toBe(stringResult.pieceType);
        expect(argsResult.position.toNotation()).toBe(stringResult.position.toNotation());
      });
    });

    it('should handle edge cases gracefully', () => {
      // Test boundary positions
      const edgeCases = [
        ['King', 'A1'], // Bottom-left corner
        ['Queen', 'H8'], // Top-right corner
        ['Pawn', 'A8'], // Pawn at top (though invalid move)
        ['King', 'H1']  // Bottom-right corner
      ];

      edgeCases.forEach(args => {
        expect(() => InputParser.parseArgs(args)).not.toThrow();
        const result = InputParser.parseArgs(args);
        expect(result.position.isValid()).toBe(true);
      });
    });
  });

  describe('error message quality', () => {
    it('should provide helpful error messages for common mistakes', () => {
      // Test common user errors and ensure helpful messages
      const errorCases = [
        { 
          args: ['king', 'D5'], // lowercase piece
          shouldNotThrow: true // Should work (case insensitive)
        },
        {
          args: ['Rook', 'D5'], // unsupported piece
          expectedError: 'Unsupported piece type: Rook'
        },
        {
          args: ['King', 'd5'], // lowercase position
          shouldNotThrow: true // Should work (case insensitive)
        },
        {
          args: ['King', 'D0'], // invalid rank
          expectedError: 'Invalid rank: 0'
        },
        {
          args: ['King', 'I5'], // invalid file
          expectedError: 'Invalid file: I'
        }
      ];

      errorCases.forEach(({ args, expectedError, shouldNotThrow }) => {
        if (shouldNotThrow) {
          expect(() => InputParser.parseArgs(args)).not.toThrow();
        } else {
          expect(() => InputParser.parseArgs(args)).toThrow(expectedError);
        }
      });
    });
  });
});