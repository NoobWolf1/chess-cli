#!/usr/bin/env node

import { ChessController } from './controllers/ChessController';
import { ErrorHandler } from './utils/ErrorHandler';

/**
 * Main application entry point
 * Handles command line arguments and orchestrates the chess movement simulation
 */
async function main(): Promise<void> {
  try {
    // Get command line arguments (excluding node and script name)
    const args = process.argv.slice(2);
    
    // Create controller instance
    const controller = new ChessController();

    // Handle help requests or invalid input
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      await controller.handleHelpOrInvalidInput(args);
      return;
    }

    // Process the chess movement request
    await controller.processCommandLineInput(args);
  } catch (error) {
    ErrorHandler.handleFatalError(error, 'Application');
  }
}

// Execute main function only if this file is run directly
if (require.main === module) {
  main().catch((error) => {
    ErrorHandler.handleFatalError(error, 'Startup');
  });
}

export { main };