import { Position } from '../models/Position';
import { QueenMovementStrategy } from '../strategies/QueenMovementStrategy';

/**
 * QueenMovementStrategy tests
 * Tests queen movement logic - unlimited steps in all 8 directions
 */
describe('QueenMovementStrategy', () => {
  let strategy: QueenMovementStrategy;

  beforeEach(() => {
    strategy = new QueenMovementStrategy();
  });

  describe('calculateValidMoves', () => {
    it('should move unlimited steps in all 8 directions from center position', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      // Queen from D4 should have many moves (7+7+3+4+3+4+3+3 = lots)
      expect(moves.length).toBeGreaterThan(20);
      
      // Check some expected moves in each direction
      const moveNotations = moves.map(m => m.toNotation());
      
      // Horizontal moves (left and right)
      expect(moveNotations).toContain('A4'); // Far left
      expect(moveNotations).toContain('B4');
      expect(moveNotations).toContain('C4');
      expect(moveNotations).toContain('E4');
      expect(moveNotations).toContain('F4');
      expect(moveNotations).toContain('G4');
      expect(moveNotations).toContain('H4'); // Far right
      
      // Vertical moves (up and down)
      expect(moveNotations).toContain('D1'); // Bottom
      expect(moveNotations).toContain('D2');
      expect(moveNotations).toContain('D3');
      expect(moveNotations).toContain('D5');
      expect(moveNotations).toContain('D6');
      expect(moveNotations).toContain('D7');
      expect(moveNotations).toContain('D8'); // Top
      
      // Diagonal moves
      expect(moveNotations).toContain('A1'); // Bottom-left diagonal
      expect(moveNotations).toContain('B2');
      expect(moveNotations).toContain('C3');
      expect(moveNotations).toContain('E5');
      expect(moveNotations).toContain('F6');
      expect(moveNotations).toContain('G7');
      expect(moveNotations).toContain('H8'); // Top-right diagonal
    });

    it('should match the example from problem statement', () => {
      // Input - Queen, E4
      // Output - A4, B4, C4, D4, F4, G4, H4, E1, E2, E3, E5, E6, E7, E8, A8, B7, C6, D5, F3, G2, H1, B1, C2, D3, F5, G6, H7
      const position = Position.fromNotation('E4');
      const moves = strategy.calculateValidMoves(position);
      
      const moveNotations = moves.map(m => m.toNotation()).sort();
      const expectedMoves = [
        'A4', 'B4', 'C4', 'D4', 'F4', 'G4', 'H4', // Horizontal
        'E1', 'E2', 'E3', 'E5', 'E6', 'E7', 'E8', // Vertical
        'A8', 'B7', 'C6', 'D5', 'F3', 'G2', 'H1', // Diagonal (top-left to bottom-right)
        'B1', 'C2', 'D3', 'F5', 'G6', 'H7'        // Diagonal (bottom-left to top-right)
      ].sort();
      
      expect(moveNotations).toEqual(expectedMoves);
    });

    it('should handle corner positions correctly', () => {
      // Bottom-left corner (A1)
      const a1 = Position.fromNotation('A1');
      const movesA1 = strategy.calculateValidMoves(a1);
      
      const notationsA1 = movesA1.map(m => m.toNotation());
      
      // Should include all positions in the same rank (horizontal)
      expect(notationsA1).toContain('B1');
      expect(notationsA1).toContain('C1');
      expect(notationsA1).toContain('H1');
      
      // Should include all positions in the same file (vertical)
      expect(notationsA1).toContain('A2');
      expect(notationsA1).toContain('A3');
      expect(notationsA1).toContain('A8');
      
      // Should include diagonal moves
      expect(notationsA1).toContain('B2');
      expect(notationsA1).toContain('C3');
      expect(notationsA1).toContain('H8');
      
      // Should have 21 total moves (7 horizontal + 7 vertical + 7 diagonal)
      expect(movesA1).toHaveLength(21);
    });

    it('should handle edge positions correctly', () => {
      // Bottom edge (D1)
      const d1 = Position.fromNotation('D1');
      const movesD1 = strategy.calculateValidMoves(d1);
      
      const notationsD1 = movesD1.map(m => m.toNotation());
      
      // Horizontal moves
      expect(notationsD1).toContain('A1');
      expect(notationsD1).toContain('H1');
      
      // Vertical moves (only upward)
      expect(notationsD1).toContain('D2');
      expect(notationsD1).toContain('D8');
      
      // Diagonal moves
      expect(notationsD1).toContain('A4'); // Up-left
      expect(notationsD1).toContain('G4'); // Up-right
      
      // Should not move below the board
      expect(notationsD1).not.toContain('D0');
    });

    it('should move in all 8 directions until board boundary', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      // Group moves by direction
      const directions = {
        left: moves.filter(m => m.rank === 4 && m.fileIndex < 3),
        right: moves.filter(m => m.rank === 4 && m.fileIndex > 3),
        down: moves.filter(m => m.file === 'D' && m.rank < 4),
        up: moves.filter(m => m.file === 'D' && m.rank > 4),
        leftDown: moves.filter(m => (m.fileIndex - 3) === -(m.rank - 4) && m.fileIndex < 3),
        leftUp: moves.filter(m => (m.fileIndex - 3) === -(m.rank - 4) && m.fileIndex < 3),
        rightDown: moves.filter(m => (m.fileIndex - 3) === (m.rank - 4) && m.fileIndex > 3),
        rightUp: moves.filter(m => (m.fileIndex - 3) === -(m.rank - 4) && m.fileIndex > 3)
      };
      
      // Left: should reach A4 (3 steps)
      expect(directions.left).toHaveLength(3);
      expect(directions.left.map(m => m.toNotation())).toContain('A4');
      
      // Right: should reach H4 (4 steps)
      expect(directions.right).toHaveLength(4);
      expect(directions.right.map(m => m.toNotation())).toContain('H4');
      
      // Down: should reach D1 (3 steps)
      expect(directions.down).toHaveLength(3);
      expect(directions.down.map(m => m.toNotation())).toContain('D1');
      
      // Up: should reach D8 (4 steps)
      expect(directions.up).toHaveLength(4);
      expect(directions.up.map(m => m.toNotation())).toContain('D8');
    });

    it('should include diagonal moves to all reachable squares', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      const moveNotations = moves.map(m => m.toNotation());
      
      // Top-left to bottom-right diagonal
      expect(moveNotations).toContain('A1');
      expect(moveNotations).toContain('B2');
      expect(moveNotations).toContain('C3');
      expect(moveNotations).toContain('E5');
      expect(moveNotations).toContain('F6');
      expect(moveNotations).toContain('G7');
      expect(moveNotations).toContain('H8');
      
      // Bottom-left to top-right diagonal
      expect(moveNotations).toContain('A7');
      expect(moveNotations).toContain('B6');
      expect(moveNotations).toContain('C5');
      expect(moveNotations).toContain('E3');
      expect(moveNotations).toContain('F2');
      expect(moveNotations).toContain('G1');
    });

    it('should not move off the board', () => {
      const position = Position.fromNotation('A1');
      const moves = strategy.calculateValidMoves(position);
      
      // Should not contain any invalid positions
      moves.forEach(move => {
        expect(move.file).toMatch(/^[A-H]$/);
        expect(move.rank).toBeGreaterThanOrEqual(1);
        expect(move.rank).toBeLessThanOrEqual(8);
        expect(move.isValid()).toBe(true);
      });
    });

    it('should work from all valid board positions', () => {
      // Test queen movement from every position on the board
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        for (let rank = 1; rank <= 8; rank++) {
          const position = Position.fromCoordinates(fileIndex, rank);
          const moves = strategy.calculateValidMoves(position);
          
          // Each position should have substantial number of moves (queen is powerful)
          expect(moves.length).toBeGreaterThan(10);
          
          // All moves should be valid positions
          moves.forEach(move => {
            expect(move.isValid()).toBe(true);
          });
        }
      }
    });

    it('should have maximum moves from center and minimum from corners', () => {
      // Center positions should have most moves
      const centerMoves = strategy.calculateValidMoves(Position.fromNotation('D4'));
      const anotherCenterMoves = strategy.calculateValidMoves(Position.fromNotation('E5'));
      
      // Corner positions should have fewer moves
      const cornerMoves = strategy.calculateValidMoves(Position.fromNotation('A1'));
      
      expect(centerMoves.length).toBeGreaterThan(cornerMoves.length);
      expect(anotherCenterMoves.length).toBeGreaterThan(cornerMoves.length);
    });
  });

  describe('boundary conditions', () => {
    it('should handle all four corners systematically', () => {
      const corners = ['A1', 'H1', 'A8', 'H8'];
      
      corners.forEach(cornerPos => {
        const position = Position.fromNotation(cornerPos);
        const moves = strategy.calculateValidMoves(position);
        
        // Each corner should have exactly 21 moves (7+7+7)
        expect(moves).toHaveLength(21);
        
        // All moves should be valid
        moves.forEach(move => {
          expect(move.isValid()).toBe(true);
        });
      });
    });

    it('should handle center positions with maximum mobility', () => {
      const centerPositions = ['D4', 'D5', 'E4', 'E5'];
      
      centerPositions.forEach(centerPos => {
        const position = Position.fromNotation(centerPos);
        const moves = strategy.calculateValidMoves(position);
        
        // Center positions should have 27 moves (maximum for queen)
        expect(moves).toHaveLength(27);
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

    it('should not include the current position in moves', () => {
      const position = Position.fromNotation('D4');
      const moves = strategy.calculateValidMoves(position);
      
      const moveNotations = moves.map(m => m.toNotation());
      expect(moveNotations).not.toContain('D4');
    });
  });
});