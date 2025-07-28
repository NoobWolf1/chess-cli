import { Position } from '../models/Position';
import { BaseMovementStrategy } from './MovementStrategy';

/**
 * Movement strategy for Pawn pieces
 * Implements Single Responsibility Principle - only handles pawn movement logic
 */
export class PawnMovementStrategy extends BaseMovementStrategy {
  /**
   * Calculates valid moves for a pawn
   * Pawns can only move 1 step forward vertically (upward for white pieces)
   */
  calculateValidMoves(position: Position): Position[] {
    const moves: Position[] = [];

    // Pawn moves forward (upward) one rank only
    const forwardMove = position.offset(0, 1);
    if (forwardMove) {
      moves.push(forwardMove);
    }

    return moves;
  }
}