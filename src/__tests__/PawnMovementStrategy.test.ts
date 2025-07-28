import { Position } from '../models/Position';
import { PawnMovementStrategy } from '../strategies/PawnMovementStrategy';

/**
 * PawnMovementStrategy tests
 * Tests pawn movement logic - one step forward only
 */
describe('PawnMovementStrategy', () => {
  let strategy: PawnMovementStrategy;

  beforeEach(() => {
    strategy = new PawnMovementStrategy();
  });

  describe('calculateValidMoves', () => {
    it('should move one step forward from starting rank', () => {
      const position = Position.fromNotation('G1');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(1);
      expect(moves[0].toNotation()).toBe('G2');
    });

    it('should move one step forward from any rank', () => {
      const testCases = [
        { from: 'A2', to: 'A3' },
        { from: 'D3', to: 'D4' },
        { from: 'H4', to: 'H5' },
        { from: 'E5', to: 'E6' },
        { from: 'B6', to: 'B7' },
        { from: 'F7', to: 'F8' }
      ];

      testCases.forEach(({ from, to }) => {
        const position = Position.fromNotation(from);
        const moves = strategy.calculateValidMoves(position);
        
        expect(moves).toHaveLength(1);
        expect(moves[0].toNotation()).toBe(to);
      });
    });

    it('should not move from top rank (8th rank)', () => {
      const testPositions = ['A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8'];

      testPositions.forEach(notation => {
        const position = Position.fromNotation(notation);
        const moves = strategy.calculateValidMoves(position);
        
        expect(moves).toHaveLength(0);
      });
    });

    it('should only move forward (upward), never backward', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(1);
      expect(moves[0].toNotation()).toBe('D5');
      
      // Verify it doesn't move to D3 (backward) or any other direction
      const moveNotations = moves.map(m => m.toNotation());
      expect(moveNotations).not.toContain('D3');
      expect(moveNotations).not.toContain('C4');
      expect(moveNotations).not.toContain('E4');
      expect(moveNotations).not.toContain('C3');
      expect(moveNotations).not.toContain('C5');
      expect(moveNotations).not.toContain('E3');
      expect(moveNotations).not.toContain('E5');
    });

    it('should work for all files', () => {
      const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      
      files.forEach(file => {
        const position = Position.fromNotation(`${file}4`);
        const moves = strategy.calculateValidMoves(position);
        
        expect(moves).toHaveLength(1);
        expect(moves[0].toNotation()).toBe(`${file}5`);
      });
    });

    it('should return empty array for positions that would move off board', () => {
      // Test all positions on the 8th rank
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const position = Position.fromCoordinates(fileIndex, 8);
        const moves = strategy.calculateValidMoves(position);
        
        expect(moves).toHaveLength(0);
      }
    });
  });

  describe('boundary conditions', () => {
    it('should handle corner positions correctly', () => {
      // Bottom corners
      const a1 = Position.fromNotation('A1');
      const h1 = Position.fromNotation('H1');
      
      expect(strategy.calculateValidMoves(a1)).toHaveLength(1);
      expect(strategy.calculateValidMoves(a1)[0].toNotation()).toBe('A2');
      
      expect(strategy.calculateValidMoves(h1)).toHaveLength(1);
      expect(strategy.calculateValidMoves(h1)[0].toNotation()).toBe('H2');
      
      // Top corners
      const a8 = Position.fromNotation('A8');
      const h8 = Position.fromNotation('H8');
      
      expect(strategy.calculateValidMoves(a8)).toHaveLength(0);
      expect(strategy.calculateValidMoves(h8)).toHaveLength(0);
    });

    it('should handle edge positions correctly', () => {
      // Left edge
      const a4 = Position.fromNotation('A4');
      const moves = strategy.calculateValidMoves(a4);
      expect(moves).toHaveLength(1);
      expect(moves[0].toNotation()).toBe('A5');
      
      // Right edge  
      const h4 = Position.fromNotation('H4');
      const movesH = strategy.calculateValidMoves(h4);
      expect(movesH).toHaveLength(1);
      expect(movesH[0].toNotation()).toBe('H5');
    });
  });

  describe('implementation consistency', () => {
    it('should always return new Position objects', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves[0]).not.toBe(position);
      expect(moves[0].equals(position)).toBe(false);
    });

    it('should not modify the input position', () => {
      const position = Position.fromNotation('D4');
      const originalNotation = position.toNotation();
      
      strategy.calculateValidMoves(position);
      
      expect(position.toNotation()).toBe(originalNotation);
    });

    it('should return consistent results for multiple calls', () => {
      const position = Position.fromNotation('D4');
      
      const moves1 = strategy.calculateValidMoves(position);
      const moves2 = strategy.calculateValidMoves(position);
      
      expect(moves1).toHaveLength(moves2.length);
      expect(moves1[0].toNotation()).toBe(moves2[0].toNotation());
    });
  });
});