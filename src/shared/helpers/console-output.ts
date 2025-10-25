import chalk from 'chalk';

/**
 * Утилиты для красивого вывода в консоль с использованием chalk
 */
export class ConsoleOutput {
  /**
   * Выводит сообщение об успешном выполнении операции
   */
  static success(message: string): void {
    console.info(chalk.green('✅'), chalk.green.bold('SUCCESS:'), chalk.green(message));
  }

  /**
   * Выводит информационное сообщение
   */
  static info(message: string): void {
    console.info(chalk.blue('ℹ️'), chalk.blue.bold('INFO:'), chalk.blue(message));
  }

  /**
   * Выводит предупреждение
   */
  static warning(message: string): void {
    console.warn(chalk.yellow('⚠️'), chalk.yellow.bold('WARNING:'), chalk.yellow(message));
  }

  /**
   * Выводит сообщение об ошибке
   */
  static error(message: string): void {
    console.error(chalk.red('❌'), chalk.red.bold('ERROR:'), chalk.red(message));
  }

  /**
   * Выводит обычное сообщение с подсветкой
   */
  static log(message: string): void {
    console.log(chalk.gray('📝'), message);
  }

  /**
   * Подсвечивает файлы/пути
   */
  static highlightFile(filepath: string): string {
    return chalk.cyan.underline(filepath);
  }

  /**
   * Подсвечивает команды
   */
  static highlightCommand(command: string): string {
    return chalk.magenta.bold(command);
  }

  /**
   * Подсвечивает числа/статистику
   */
  static highlightNumber(number: string | number): string {
    return chalk.yellow.bold(number.toString());
  }

  /**
   * Создает заголовок раздела
   */
  static section(title: string): void {
    console.log(`\n${ chalk.bgBlue.white.bold(` ${title} `) }\n`);
  }

  /**
   * Выводит данные в формате таблицы/структуры
   */
  static data(label: string, value: unknown): void {
    console.log(chalk.gray(`${label}:`), chalk.white(typeof value === 'object' ? JSON.stringify(value, null, 2) : value));
  }

  /**
   * Выводит прогресс операции
   */
  static progress(message: string): void {
    console.log(chalk.cyan('⏳'), chalk.cyan(message));
  }
}
