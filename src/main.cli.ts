import 'reflect-metadata';
import { CLIApp } from './cli/cli-app.js';
import { GenerateCommand } from './cli/commands/generate.command.js';
import { HelpCommand, ImportCommand, VersionCommand } from './index.js';
function bootstrap() {
  const cliApp = new CLIApp();

  cliApp.registerCommands([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);


  cliApp.processCommand(process.argv);
}

bootstrap();

