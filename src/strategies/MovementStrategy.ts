import { Position } from '../models/Position';

/**
 * Strategy pattern interface for chess piece movement calculations
 * Follows Interface Segregation Principle by defining minimal interface
 */
export interface MovementStrategy {
  /**
   * Calculates all valid moves for a piece from given position
   * @param position - Current position of the piece
   * @returns Array of valid destination positions
   */
  calculateValidMoves(position: Position): Position[];
}

/**
 * Abstract base class providing common movement utilities
 * Follows DRY principle and Template Method pattern
 */
export abstract class BaseMovementStrategy implements MovementStrategy {
  abstract calculateValidMoves(position: Position): Position[];

  /**
   * Generates moves in a specific direction until board boundary
   * @param position - Starting position
   * @param fileDirection - File direction (-1, 0, 1)
   * @param rankDirection - Rank direction (-1, 0, 1)
   * @param maxSteps - Maximum steps to take (undefined for unlimited)
   * @returns Array of valid positions in the direction
   */
  protected generateMovesInDirection(
    position: Position,
    fileDirection: number,
    rankDirection: number,
    maxSteps?: number
  ): Position[] {
    const moves: Position[] = [];
    let steps = 0;
    let currentPos = position;

    while (maxSteps === undefined || steps < maxSteps) {
      const nextPos = currentPos.offset(fileDirection, rankDirection);
      if (!nextPos) {
        break;
      }

      moves.push(nextPos);
      currentPos = nextPos;
      steps++;
    }

    return moves;
  }

  /**
   * Generates moves in all eight directions
   * @param position - Starting position
   * @param maxSteps - Maximum steps in each direction
   * @returns Array of all valid positions in all directions
   */
  protected generateMovesInAllDirections(position: Position, maxSteps?: number): Position[] {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], // Left-down, Left, Left-up
      [0, -1],           [0, 1],  // Down, Up
      [1, -1],  [1, 0],  [1, 1]   // Right-down, Right, Right-up
    ];

    const allMoves: Position[] = [];

    for (const [fileDir, rankDir] of directions) {
      const movesInDirection = this.generateMovesInDirection(
        position,
        fileDir,
        rankDir,
        maxSteps
      );
      allMoves.push(...movesInDirection);
    }

    return allMoves;
  }
}