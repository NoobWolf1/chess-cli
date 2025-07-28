import { Position } from '../models/Position';
import { BaseMovementStrategy } from './MovementStrategy';

/**
 * Movement strategy for Queen pieces
 * Implements Single Responsibility Principle - only handles queen movement logic
 */
export class QueenMovementStrategy extends BaseMovementStrategy {
  /**
   * Calculates valid moves for a queen
   * Queen can move unlimited steps in all 8 directions until board boundary
   */
  calculateValidMoves(position: Position): Position[] {
    // Use base class method without maxSteps limit for queen's unlimited movement
    return this.generateMovesInAllDirections(position);
  }
}