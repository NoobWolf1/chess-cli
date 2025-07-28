/**
 * Represents a position on the chessboard using algebraic notation
 * Implements value object pattern with immutability
 */
export class Position {
  private readonly _file: string;
  private readonly _rank: number;

  constructor(file: string, rank: number) {
    this.validateFile(file);
    this.validateRank(rank);
    
    this._file = file.toUpperCase();
    this._rank = rank;
  }

  /**
   * Creates a Position from algebraic notation (e.g., "A1", "H8")
   */
  static fromNotation(notation: string): Position {
    if (!notation || notation.length !== 2) {
      throw new Error(`Invalid notation: ${notation}. Expected format like 'A1' or 'H8'.`);
    }

    const file = notation.charAt(0).toUpperCase();
    const rank = parseInt(notation.charAt(1), 10);

    return new Position(file, rank);
  }

  /**
   * Creates a Position from file index (0-7) and rank (1-8)
   */
  static fromCoordinates(fileIndex: number, rank: number): Position {
    const file = String.fromCharCode(65 + fileIndex); // 65 is 'A'
    return new Position(file, rank);
  }

  get file(): string {
    return this._file;
  }

  get rank(): number {
    return this._rank;
  }

  get fileIndex(): number {
    return this._file.charCodeAt(0) - 65; // Convert A-H to 0-7
  }

  /**
   * Returns the algebraic notation of this position
   */
  toNotation(): string {
    return `${this._file}${this._rank}`;
  }

  /**
   * Checks if this position is within the chessboard boundaries
   */
  isValid(): boolean {
    return this.isValidFile(this._file) && this.isValidRank(this._rank);
  }

  /**
   * Checks if this position equals another position
   */
  equals(other: Position): boolean {
    return this._file === other._file && this._rank === other._rank;
  }

  /**
   * Creates a new position with offset applied
   */
  offset(fileOffset: number, rankOffset: number): Position | null {
    const newFileIndex = this.fileIndex + fileOffset;
    const newRank = this._rank + rankOffset;

    if (newFileIndex < 0 || newFileIndex > 7 || newRank < 1 || newRank > 8) {
      return null;
    }

    return Position.fromCoordinates(newFileIndex, newRank);
  }

  private validateFile(file: string): void {
    if (!this.isValidFile(file)) {
      throw new Error(`Invalid file: ${file}. Must be A-H.`);
    }
  }

  private validateRank(rank: number): void {
    if (!this.isValidRank(rank)) {
      throw new Error(`Invalid rank: ${rank}. Must be 1-8.`);
    }
  }

  private isValidFile(file: string): boolean {
    const upperFile = file.toUpperCase();
    return upperFile >= 'A' && upperFile <= 'H';
  }

  private isValidRank(rank: number): boolean {
    return Number.isInteger(rank) && rank >= 1 && rank <= 8;
  }

  toString(): string {
    return this.toNotation();
  }
}