import { Position } from '../models/Position';

/**
 * Utility class for sorting chess positions
 * Implements Single Responsibility Principle - only handles position sorting
 */
export class PositionSorter {
  /**
   * Sorts positions in chess notation order
   * Primary sort: file (A-H), Secondary sort: rank (1-8)
   * This matches the expected output format shown in examples
   * @param positions - Array of positions to sort
   * @returns New sorted array of positions
   */
  static sort(positions: Position[]): Position[] {
    return [...positions].sort((a, b) => {
      // Primary sort by file (A comes before B, etc.)
      const fileComparison = a.file.localeCompare(b.file);
      if (fileComparison !== 0) {
        return fileComparison;
      }

      // Secondary sort by rank (1 comes before 2, etc.)
      return a.rank - b.rank;
    });
  }

  /**
   * Converts sorted positions to comma-separated string format
   * @param positions - Array of positions
   * @returns Comma-separated string of position notations
   */
  static toOutputString(positions: Position[]): string {
    const sortedPositions = this.sort(positions);
    return sortedPositions.map(pos => pos.toNotation()).join(', ');
  }

  /**
   * Sorts positions and removes duplicates
   * @param positions - Array of positions that may contain duplicates
   * @returns New sorted array without duplicates
   */
  static sortAndDeduplicate(positions: Position[]): Position[] {
    const uniquePositions = positions.filter((position, index, array) => 
      array.findIndex(p => p.equals(position)) === index
    );

    return this.sort(uniquePositions);
  }
}