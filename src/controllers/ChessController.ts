import { ChessMovementService } from '../services/ChessMovementService';
import { InputParser, ParsedInput } from '../utils/InputParser';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Controller class handling chess movement requests
 * Implements Single Responsibility Principle - orchestrates the flow between input, service, and output
 * Follows MVC pattern for separation of concerns
 */
export class ChessController {
  private readonly chessService: ChessMovementService;

  constructor(chessService: ChessMovementService = new ChessMovementService()) {
    this.chessService = chessService;
  }

  /**
   * Processes command line arguments and outputs valid moves
   * @param args - Command line arguments
   * @returns Promise that resolves when processing is complete
   */
  async processCommandLineInput(args: string[]): Promise<void> {
    try {
      // Parse input arguments
      const parsedInput = InputParser.parseArgs(args);
      
      // Process the chess movement request
      await this.processMovementRequest(parsedInput);
    } catch (error) {
      ErrorHandler.handleFatalError(error, 'Input Processing');
    }
  }

  /**
   * Processes a movement request and outputs the result
   * @param parsedInput - Parsed input containing piece type and position
   * @returns Promise that resolves when processing is complete
   */
  async processMovementRequest(parsedInput: ParsedInput): Promise<void> {
    try {
      const { pieceType, position } = parsedInput;

      // Validate piece type is supported
      if (!this.chessService.isPieceTypeSupported(pieceType)) {
        throw new Error(`Unsupported piece type: ${pieceType}`);
      }

      // Calculate valid moves
      const validMovesString = await this.chessService.calculateValidMovesAsString(
        pieceType,
        position
      );

      // Output the result
      this.outputResult(validMovesString);
    } catch (error) {
      ErrorHandler.handleFatalError(error, 'Movement Calculation');
    }
  }

  /**
   * Outputs the calculation result to console
   * @param result - Formatted string of valid moves
   */
  private outputResult(result: string): void {
    console.log(result);
  }

  /**
   * Displays help information for proper usage
   */
  displayHelp(): void {
    console.log(InputParser.getUsageHelp());
  }

  /**
   * Processes help request or invalid arguments
   * @param args - Command line arguments
   */
  async handleHelpOrInvalidInput(args: string[]): Promise<void> {
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      this.displayHelp();
      return;
    }

    // Try to provide more specific error information
    try {
      InputParser.parseArgs(args);
    } catch (error) {
      ErrorHandler.handleError(error, 'Input Validation');
      console.log('\n');
      this.displayHelp();
      process.exit(1);
    }
  }
}