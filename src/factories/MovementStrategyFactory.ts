import { PieceType } from '../models/PieceType';
import { MovementStrategy } from '../strategies/MovementStrategy';
import { PawnMovementStrategy } from '../strategies/PawnMovementStrategy';
import { KingMovementStrategy } from '../strategies/KingMovementStrategy';
import { QueenMovementStrategy } from '../strategies/QueenMovementStrategy';

/**
 * Factory for creating movement strategies
 * Implements Factory Pattern and follows Open/Closed Principle
 * New piece types can be added without modifying existing code
 */
export class MovementStrategyFactory {
  private static readonly strategyMap = new Map<PieceType, () => MovementStrategy>([
    [PieceType.PAWN, () => new PawnMovementStrategy()],
    [PieceType.KING, () => new KingMovementStrategy()],
    [PieceType.QUEEN, () => new QueenMovementStrategy()]
  ]);

  /**
   * Creates appropriate movement strategy for given piece type
   * @param pieceType - Type of chess piece
   * @returns Movement strategy instance
   * @throws Error if piece type is not supported
   */
  static createStrategy(pieceType: PieceType): MovementStrategy {
    const strategyCreator = this.strategyMap.get(pieceType);
    
    if (!strategyCreator) {
      throw new Error(`No movement strategy found for piece type: ${pieceType}`);
    }

    return strategyCreator();
  }

  /**
   * Checks if a piece type has a corresponding movement strategy
   * @param pieceType - Type of chess piece
   * @returns True if strategy exists, false otherwise
   */
  static hasStrategy(pieceType: PieceType): boolean {
    return this.strategyMap.has(pieceType);
  }

  /**
   * Returns all supported piece types
   * @returns Array of supported piece types
   */
  static getSupportedPieceTypes(): PieceType[] {
    return Array.from(this.strategyMap.keys());
  }
}