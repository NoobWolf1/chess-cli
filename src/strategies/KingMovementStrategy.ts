import { Position } from '../models/Position';
import { BaseMovementStrategy } from './MovementStrategy';

/**
 * Movement strategy for King pieces
 * Implements Single Responsibility Principle - only handles king movement logic
 */
export class KingMovementStrategy extends BaseMovementStrategy {
  /**
   * Calculates valid moves for a king
   * King can move 1 step in all 8 directions (horizontal, vertical, diagonal)
   */
  calculateValidMoves(position: Position): Position[] {
    // Use base class method with maxSteps = 1 for king's limited movement
    return this.generateMovesInAllDirections(position, 1);
  }
}