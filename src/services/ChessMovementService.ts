import { PieceType } from '../models/PieceType';
import { Position } from '../models/Position';
import { MovementStrategyFactory } from '../factories/MovementStrategyFactory';
import { PositionSorter } from '../utils/PositionSorter';

/**
 * Service class for chess movement calculations
 * Implements Single Responsibility Principle - coordinates movement calculation workflow
 * Follows Dependency Inversion Principle - depends on abstractions, not concretions
 */
export class ChessMovementService {
  /**
   * Calculates all valid moves for a piece at given position
   * @param pieceType - Type of chess piece
   * @param position - Current position of the piece
   * @returns Sorted array of valid destination positions
   */
  async calculateValidMoves(pieceType: PieceType, position: Position): Promise<Position[]> {
    try {
      // Use factory to get appropriate strategy (Dependency Inversion)
      const movementStrategy = MovementStrategyFactory.createStrategy(pieceType);
      
      // Calculate valid moves using strategy
      const validMoves = movementStrategy.calculateValidMoves(position);
      
      // Sort and deduplicate results
      return PositionSorter.sortAndDeduplicate(validMoves);
    } catch (error) {
      throw new Error(`Failed to calculate moves: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculates valid moves and returns formatted output string
   * @param pieceType - Type of chess piece
   * @param position - Current position of the piece
   * @returns Comma-separated string of valid positions
   */
  async calculateValidMovesAsString(pieceType: PieceType, position: Position): Promise<string> {
    const validMoves = await this.calculateValidMoves(pieceType, position);
    return PositionSorter.toOutputString(validMoves);
  }

  /**
   * Validates if a piece type is supported
   * @param pieceType - Type of chess piece to validate
   * @returns True if supported, false otherwise
   */
  isPieceTypeSupported(pieceType: PieceType): boolean {
    return MovementStrategyFactory.hasStrategy(pieceType);
  }

  /**
   * Returns all supported piece types
   * @returns Array of supported piece types
   */
  getSupportedPieceTypes(): PieceType[] {
    return MovementStrategyFactory.getSupportedPieceTypes();
  }
}