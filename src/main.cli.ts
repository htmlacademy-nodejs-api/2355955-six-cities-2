import {HelpCommand, ImportCommand, VersionCommand} from './index.js';
import {CLIApp} from './cli/cli-app.js';

function bootstrap() {
  const cliApp = new CLIApp();

  cliApp.registerCommands([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand(),
  ]);

  cliApp.processCommand(process.argv);
}

bootstrap();

