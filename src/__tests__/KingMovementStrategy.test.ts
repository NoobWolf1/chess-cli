import { Position } from '../models/Position';
import { KingMovementStrategy } from '../strategies/KingMovementStrategy';

/**
 * KingMovementStrategy tests
 * Tests king movement logic - one step in all 8 directions
 */
describe('KingMovementStrategy', () => {
  let strategy: KingMovementStrategy;

  beforeEach(() => {
    strategy = new KingMovementStrategy();
  });

  describe('calculateValidMoves', () => {
    it('should move one step in all 8 directions from center position', () => {
      const position = Position.fromNotation('D5');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(8);
      
      const moveNotations = moves.map(m => m.toNotation()).sort();
      expect(moveNotations).toEqual(['C4', 'C5', 'C6', 'D4', 'D6', 'E4', 'E5', 'E6']);
    });

    it('should match the example from problem statement', () => {
      // Input - King, D5
      // Output - C4, C5, C6, D4, D6, E4, E5, E6
      const position = Position.fromNotation('D5');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(8);
      
      const moveNotations = moves.map(m => m.toNotation()).sort();
      expect(moveNotations).toEqual(['C4', 'C5', 'C6', 'D4', 'D6', 'E4', 'E5', 'E6']);
    });

    it('should handle corner positions correctly', () => {
      // Bottom-left corner (A1)
      const a1 = Position.fromNotation('A1');
      const movesA1 = strategy.calculateValidMoves(a1);
      
      expect(movesA1).toHaveLength(3);
      const notationsA1 = movesA1.map(m => m.toNotation()).sort();
      expect(notationsA1).toEqual(['A2', 'B1', 'B2']);
      
      // Top-right corner (H8)
      const h8 = Position.fromNotation('H8');
      const movesH8 = strategy.calculateValidMoves(h8);
      
      expect(movesH8).toHaveLength(3);
      const notationsH8 = movesH8.map(m => m.toNotation()).sort();
      expect(notationsH8).toEqual(['G7', 'G8', 'H7']);
      
      // Bottom-right corner (H1)
      const h1 = Position.fromNotation('H1');
      const movesH1 = strategy.calculateValidMoves(h1);
      
      expect(movesH1).toHaveLength(3);
      const notationsH1 = movesH1.map(m => m.toNotation()).sort();
      expect(notationsH1).toEqual(['G1', 'G2', 'H2']);
      
      // Top-left corner (A8)
      const a8 = Position.fromNotation('A8');
      const movesA8 = strategy.calculateValidMoves(a8);
      
      expect(movesA8).toHaveLength(3);
      const notationsA8 = movesA8.map(m => m.toNotation()).sort();
      expect(notationsA8).toEqual(['A7', 'B7', 'B8']);
    });

    it('should handle edge positions correctly', () => {
      // Bottom edge (not corners)
      const d1 = Position.fromNotation('D1');
      const movesD1 = strategy.calculateValidMoves(d1);
      
      expect(movesD1).toHaveLength(5);
      const notationsD1 = movesD1.map(m => m.toNotation()).sort();
      expect(notationsD1).toEqual(['C1', 'C2', 'D2', 'E1', 'E2']);
      
      // Top edge (not corners)
      const d8 = Position.fromNotation('D8');
      const movesD8 = strategy.calculateValidMoves(d8);
      
      expect(movesD8).toHaveLength(5);
      const notationsD8 = movesD8.map(m => m.toNotation()).sort();
      expect(notationsD8).toEqual(['C7', 'C8', 'D7', 'E7', 'E8']);
      
      // Left edge (not corners)
      const a4 = Position.fromNotation('A4');
      const movesA4 = strategy.calculateValidMoves(a4);
      
      expect(movesA4).toHaveLength(5);
      const notationsA4 = movesA4.map(m => m.toNotation()).sort();
      expect(notationsA4).toEqual(['A3', 'A5', 'B3', 'B4', 'B5']);
      
      // Right edge (not corners)
      const h4 = Position.fromNotation('H4');
      const movesH4 = strategy.calculateValidMoves(h4);
      
      expect(movesH4).toHaveLength(5);
      const notationsH4 = movesH4.map(m => m.toNotation()).sort();
      expect(notationsH4).toEqual(['G3', 'G4', 'G5', 'H3', 'H5']);
    });

    it('should move exactly one step in each direction', () => {
      const position = Position.fromNotation('E4');
      const moves = strategy.calculateValidMoves(position);
      
      // Verify each move is exactly one step away
      moves.forEach(move => {
        const fileDiff = Math.abs(move.fileIndex - position.fileIndex);
        const rankDiff = Math.abs(move.rank - position.rank);
        
        // King moves exactly one step, so max difference in any direction is 1
        expect(fileDiff).toBeLessThanOrEqual(1);
        expect(rankDiff).toBeLessThanOrEqual(1);
        
        // At least one direction must have changed
        expect(fileDiff + rankDiff).toBeGreaterThan(0);
      });
    });

    it('should include all 8 directions when possible', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      expect(moves).toHaveLength(8);
      
      // Check each of the 8 directions
      const directions = [
        [-1, -1], [-1, 0], [-1, 1], // Left-down, Left, Left-up
        [0, -1],           [0, 1],  // Down, Up
        [1, -1],  [1, 0],  [1, 1]   // Right-down, Right, Right-up
      ];
      
      directions.forEach(([fileOffset, rankOffset]) => {
        const expectedFile = String.fromCharCode(position.file.charCodeAt(0) + fileOffset);
        const expectedRank = position.rank + rankOffset;
        const expectedNotation = `${expectedFile}${expectedRank}`;
        
        const moveNotations = moves.map(m => m.toNotation());
        expect(moveNotations).toContain(expectedNotation);
      });
    });

    it('should not move off the board', () => {
      const position = Position.fromNotation('A1');
      const moves = strategy.calculateValidMoves(position);
      
      // Should not contain any invalid positions
      moves.forEach(move => {
        expect(move.file).toMatch(/^[A-H]$/);
        expect(move.rank).toBeGreaterThanOrEqual(1);
        expect(move.rank).toBeLessThanOrEqual(8);
      });
      
      // Specifically should not try to move to invalid positions
      const moveNotations = moves.map(m => m.toNotation());
      expect(moveNotations).not.toContain('Z1'); // Invalid file
      expect(moveNotations).not.toContain('A0'); // Invalid rank
      expect(moveNotations).not.toContain('A9'); // Invalid rank
    });

    it('should work from all valid board positions', () => {
      // Test king movement from every position on the board
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        for (let rank = 1; rank <= 8; rank++) {
          const position = Position.fromCoordinates(fileIndex, rank);
          const moves = strategy.calculateValidMoves(position);
          
          // Each position should have some valid moves (3-8 depending on position)
          expect(moves.length).toBeGreaterThan(0);
          expect(moves.length).toBeLessThanOrEqual(8);
          
          // All moves should be valid positions
          moves.forEach(move => {
            expect(move.isValid()).toBe(true);
          });
        }
      }
    });
  });

  describe('boundary conditions', () => {
    it('should handle all four corners systematically', () => {
      const corners = [
        { position: 'A1', expectedMoves: 3, name: 'bottom-left' },
        { position: 'H1', expectedMoves: 3, name: 'bottom-right' },
        { position: 'A8', expectedMoves: 3, name: 'top-left' },
        { position: 'H8', expectedMoves: 3, name: 'top-right' }
      ];
      
      corners.forEach(({ position, expectedMoves }) => {
        const pos = Position.fromNotation(position);
        const moves = strategy.calculateValidMoves(pos);
        
        expect(moves).toHaveLength(expectedMoves);
        
        // All moves should be valid and adjacent
        moves.forEach(move => {
          const fileDiff = Math.abs(move.fileIndex - pos.fileIndex);
          const rankDiff = Math.abs(move.rank - pos.rank);
          
          expect(fileDiff).toBeLessThanOrEqual(1);
          expect(rankDiff).toBeLessThanOrEqual(1);
          expect(fileDiff + rankDiff).toBeGreaterThan(0);
        });
      });
    });

    it('should handle all four edges systematically', () => {
      const edges = [
        { position: 'D1', expectedMoves: 5, name: 'bottom edge' },
        { position: 'D8', expectedMoves: 5, name: 'top edge' },
        { position: 'A4', expectedMoves: 5, name: 'left edge' },
        { position: 'H4', expectedMoves: 5, name: 'right edge' }
      ];
      
      edges.forEach(({ position, expectedMoves }) => {
        const pos = Position.fromNotation(position);
        const moves = strategy.calculateValidMoves(pos);
        
        expect(moves).toHaveLength(expectedMoves);
      });
    });
  });

  describe('implementation consistency', () => {
    it('should always return new Position objects', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      moves.forEach(move => {
        expect(move).not.toBe(position);
      });
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
      
      const notations1 = moves1.map(m => m.toNotation()).sort();
      const notations2 = moves2.map(m => m.toNotation()).sort();
      expect(notations1).toEqual(notations2);
    });

    it('should not return duplicate moves', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      const notations = moves.map(m => m.toNotation());
      const uniqueNotations = [...new Set(notations)];
      
      expect(notations).toHaveLength(uniqueNotations.length);
    });
  });
});