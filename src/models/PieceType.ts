/**
 * Enumeration of supported chess piece types
 */
export enum PieceType {
  PAWN = 'Pawn',
  KING = 'King',
  QUEEN = 'Queen'
}

/**
 * Utility class for PieceType operations
 */
export class PieceTypeUtils {
  /**
   * Converts string to PieceType enum
   * Case-insensitive matching
   */
  static fromString(pieceStr: string): PieceType {
    const normalizedStr = pieceStr.trim();
    const upperStr = normalizedStr.charAt(0).toUpperCase() + normalizedStr.slice(1).toLowerCase();
    
    const pieceType = Object.values(PieceType).find(type => type === upperStr);
    
    if (!pieceType) {
      throw new Error(`Unsupported piece type: ${pieceStr}. Supported types: ${Object.values(PieceType).join(', ')}`);
    }
    
    return pieceType;
  }

  /**
   * Validates if a string represents a valid piece type
   */
  static isValid(pieceStr: string): boolean {
    try {
      PieceTypeUtils.fromString(pieceStr);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns all supported piece types
   */
  static getAllTypes(): PieceType[] {
    return Object.values(PieceType);
  }
}