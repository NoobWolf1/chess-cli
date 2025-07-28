import { Position } from '../models/Position';
import { BaseMovementStrategy } from '../strategies/MovementStrategy';

/**
 * Test implementation of BaseMovementStrategy for testing purposes
 */
class TestMovementStrategy extends BaseMovementStrategy {
  calculateValidMoves(position: Position): Position[] {
    // Simple test implementation - return one move up
    const move = position.offset(0, 1);
    return move ? [move] : [];
  }

  // Expose protected methods for testing
  public testGenerateMovesInDirection(
    position: Position,
    fileDirection: number,
    rankDirection: number,
    maxSteps?: number
  ): Position[] {
    return this.generateMovesInDirection(position, fileDirection, rankDirection, maxSteps);
  }

  public testGenerateMovesInAllDirections(position: Position, maxSteps?: number): Position[] {
    return this.generateMovesInAllDirections(position, maxSteps);
  }
}

/**
 * MovementStrategy and BaseMovementStrategy tests
 * Tests the strategy pattern interface and base implementation
 */
describe('MovementStrategy', () => {
  describe('interface contract', () => {
    it('should define calculateValidMoves method', () => {
      const strategy = new TestMovementStrategy();
      expect(typeof strategy.calculateValidMoves).toBe('function');
    });
  });
});

describe('BaseMovementStrategy', () => {
  let strategy: TestMovementStrategy;

  beforeEach(() => {
    strategy = new TestMovementStrategy();
  });

  describe('generateMovesInDirection', () => {
    it('should generate moves in positive file direction', () => {
      const position = Position.fromNotation('A1');
      const moves = strategy.testGenerateMovesInDirection(position, 1, 0); // Right
      
      expect(moves).toHaveLength(7);
      expect(moves[0].toNotation()).toBe('B1');
      expect(moves[1].toNotation()).toBe('C1');
      expect(moves[6].toNotation()).toBe('H1');
    });

    it('should generate moves in negative file direction', () => {
      const position = Position.fromNotation('H1');
      const moves = strategy.testGenerateMovesInDirection(position, -1, 0); // Left
      
      expect(moves).toHaveLength(7);
      expect(moves[0].toNotation()).toBe('G1');
      expect(moves[1].toNotation()).toBe('F1');
      expect(moves[6].toNotation()).toBe('A1');
    });

    it('should generate moves in positive rank direction', () => {
      const position = Position.fromNotation('A1');
      const moves = strategy.testGenerateMovesInDirection(position, 0, 1); // Up
      
      expect(moves).toHaveLength(7);
      expect(moves[0].toNotation()).toBe('A2');
      expect(moves[1].toNotation()).toBe('A3');
      expect(moves[6].toNotation()).toBe('A8');
    });

    it('should generate moves in negative rank direction', () => {
      const position = Position.fromNotation('A8');
      const moves = strategy.testGenerateMovesInDirection(position, 0, -1); // Down
      
      expect(moves).toHaveLength(7);
      expect(moves[0].toNotation()).toBe('A7');
      expect(moves[1].toNotation()).toBe('A6');
      expect(moves[6].toNotation()).toBe('A1');
    });

    it('should generate diagonal moves', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.testGenerateMovesInDirection(position, 1, 1); // Up-right diagonal
      
      expect(moves).toHaveLength(4);
      expect(moves[0].toNotation()).toBe('E5');
      expect(moves[1].toNotation()).toBe('F6');
      expect(moves[2].toNotation()).toBe('G7');
      expect(moves[3].toNotation()).toBe('H8');
    });

    it('should respect maxSteps limit', () => {
      const position = Position.fromNotation('A1');
      const moves = strategy.testGenerateMovesInDirection(position, 1, 0, 3); // Right, max 3 steps
      
      expect(moves).toHaveLength(3);
      expect(moves[0].toNotation()).toBe('B1');
      expect(moves[1].toNotation()).toBe('C1');
      expect(moves[2].toNotation()).toBe('D1');
    });

    it('should stop at board boundary', () => {
      const position = Position.fromNotation('G1');
      const moves = strategy.testGenerateMovesInDirection(position, 1, 0); // Right from G1
      
      expect(moves).toHaveLength(1);
      expect(moves[0].toNotation()).toBe('H1');
    });

    it('should return empty array when at board edge', () => {
      const position = Position.fromNotation('H1');
      const moves = strategy.testGenerateMovesInDirection(position, 1, 0); // Right from H1
      
      expect(moves).toHaveLength(0);
    });

    it('should handle zero maxSteps', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.testGenerateMovesInDirection(position, 1, 0, 0);
      
      expect(moves).toHaveLength(0);
    });
  });

  describe('generateMovesInAllDirections', () => {
    it('should generate moves in all 8 directions from center', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.testGenerateMovesInAllDirections(position);
      
      // Should have moves in all 8 directions
      expect(moves.length).toBeGreaterThan(0);
      
      // Check some expected moves in different directions
      const moveNotations = moves.map(m => m.toNotation());
      expect(moveNotations).toContain('C3'); // Left-down
      expect(moveNotations).toContain('C4'); // Left
      expect(moveNotations).toContain('C5'); // Left-up
      expect(moveNotations).toContain('D3'); // Down
      expect(moveNotations).toContain('D5'); // Up
      expect(moveNotations).toContain('E3'); // Right-down
      expect(moveNotations).toContain('E4'); // Right
      expect(moveNotations).toContain('E5'); // Right-up
    });

    it('should generate limited moves with maxSteps', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.testGenerateMovesInAllDirections(position, 1);
      
      expect(moves).toHaveLength(8); // One move in each of 8 directions
      
      const moveNotations = moves.map(m => m.toNotation()).sort();
      expect(moveNotations).toEqual(['C3', 'C4', 'C5', 'D3', 'D5', 'E3', 'E4', 'E5']);
    });

    it('should handle corner position', () => {
      const position = Position.fromNotation('A1');
      const moves = strategy.testGenerateMovesInAllDirections(position, 1);
      
      expect(moves).toHaveLength(3); // Only 3 directions available from corner
      
      const moveNotations = moves.map(m => m.toNotation()).sort();
      expect(moveNotations).toEqual(['A2', 'B1', 'B2']);
    });

    it('should handle edge position', () => {
      const position = Position.fromNotation('A4');
      const moves = strategy.testGenerateMovesInAllDirections(position, 1);
      
      expect(moves).toHaveLength(5); // 5 directions available from left edge
      
      const moveNotations = moves.map(m => m.toNotation()).sort();
      expect(moveNotations).toEqual(['A3', 'A5', 'B3', 'B4', 'B5']);
    });

    it('should return empty array when maxSteps is 0', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.testGenerateMovesInAllDirections(position, 0);
      
      expect(moves).toHaveLength(0);
    });
  });

  describe('calculateValidMoves implementation', () => {
    it('should return moves according to test implementation', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(1);
      expect(moves[0].toNotation()).toBe('D5');
    });

    it('should return empty array when move is not possible', () => {
      const position = Position.fromNotation('D8'); // Top rank
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(0);
    });
  });
});