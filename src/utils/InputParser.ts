import { PieceType, PieceTypeUtils } from '../models/PieceType';
import { Position } from '../models/Position';

/**
 * Represents parsed input containing piece type and position
 */
export interface ParsedInput {
  pieceType: PieceType;
  position: Position;
}

/**
 * Utility class for parsing command line input
 * Implements Single Responsibility Principle - only handles input parsing
 */
export class InputParser {
  /**
   * Parses command line arguments into structured input
   * Expected format: ["PieceType", "Position"] e.g., ["King", "D5"]
   * @param args - Command line arguments
   * @returns Parsed input object
   * @throws Error if input format is invalid
   */
  static parseArgs(args: string[]): ParsedInput {
    this.validateArgsLength(args);
    
    const [pieceTypeStr, positionStr] = args;
    
    try {
      const pieceType = PieceTypeUtils.fromString(pieceTypeStr);
      const position = Position.fromNotation(positionStr);

      return { pieceType, position };
    } catch (error) {
      throw new Error(`Invalid input: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parses comma-separated input string
   * Expected format: "PieceType, Position" e.g., "King, D5"
   * @param input - Input string
   * @returns Parsed input object
   * @throws Error if input format is invalid
   */
  static parseString(input: string): ParsedInput {
    if (!input || typeof input !== 'string') {
      throw new Error('Input must be a non-empty string');
    }

    const parts = input.split(',').map(part => part.trim());
    
    if (parts.length !== 2) {
      throw new Error(`Invalid input format: "${input}". Expected format: "PieceType, Position"`);
    }

    return this.parseArgs(parts);
  }

  /**
   * Validates command line arguments count
   * @param args - Command line arguments
   * @throws Error if argument count is invalid
   */
  private static validateArgsLength(args: string[]): void {
    if (!args || args.length === 0) {
      throw new Error('No arguments provided. Usage: <PieceType> <Position>');
    }

    if (args.length !== 2) {
      throw new Error(`Invalid number of arguments: ${args.length}. Expected: 2. Usage: <PieceType> <Position>`);
    }

    if (args.some(arg => !arg || arg.trim().length === 0)) {
      throw new Error('Arguments cannot be empty. Usage: <PieceType> <Position>');
    }
  }

  /**
   * Creates help message for command usage
   * @returns Help message string
   */
  static getUsageHelp(): string {
    const supportedPieces = PieceTypeUtils.getAllTypes().join(', ');
    return `
Usage: npm start <PieceType> <Position>

Arguments:
  PieceType    Type of chess piece (${supportedPieces})
  Position     Position on chessboard in algebraic notation (e.g., A1, H8)

Examples:
  npm start King D5
  npm start Queen E4
  npm start Pawn G1
`;
  }
}