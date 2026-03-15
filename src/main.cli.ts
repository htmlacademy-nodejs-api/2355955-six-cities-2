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


  /**
   * Объект process предоставляет информацию о текущем процессе Node.js.
   * process.argv — массив переданных аргументов командной строки.
   * Пример: при вызове `npm run ts ./src/main.cli.ts -- --help`
   * (двойной дефис `--` указывает npm передать последующие аргументы нашему скрипту, а не обрабатывать их самому)
   * process.argv будет содержать:
   * [
   *   'C:\\Program Files\\nodejs\\node.exe', // Путь к исполняемому файлу Node
   *   'C:\\...\\src\\main.cli.ts',           // Путь к выполняемому файлу
   *   '--help'                               // Переданные аргументы
   * ]
   */
  cliApp.processCommand(process.argv);

}

bootstrap();

