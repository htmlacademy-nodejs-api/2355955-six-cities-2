type ParsedCommand = Record<string, string[]>;

/**
 * Парсер аргументов CLI.
 *
 * @example
 * // Вход: process.argv = ['node', 'cli.js', '--import', 'mocks/test-data.tsv']
 * // Результат:
 * // { '--import': ['mocks/test-data.tsv'] }
 *
 * @example
 * // Вход: process.argv = ['node', 'cli.js', '--generate', '10', 'mocks/output.tsv', 'http://localhost:3000']
 * // Результат:
 * // { '--generate': ['10', 'mocks/output.tsv', 'http://localhost:3000'] }
 *
 * @example
 * // Вход: process.argv = ['node', 'cli.js', '--import', 'file.tsv', '--help']
 * // Результат:
 * // { '--import': ['file.tsv'], '--help': [] }
 */
export class CommandParser {
  /**
   * Парсит массив аргументов CLI вида process.argv в словарь флагов и их значений.
   * @param {string[]} cliArgs Аргументы CLI, например ['--import', 'mocks/test-data.tsv']
   * @returns {ParsedCommand} Объект вида { '--import': ['mocks/test-data.tsv'] }
   */
  static parse(cliArgs: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand: string = '';

    for (const argument of cliArgs) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }
    return parsedCommand;
  }
}
