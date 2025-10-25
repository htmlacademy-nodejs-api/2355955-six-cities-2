
import { ConsoleOutput } from '../../shared/helpers/index.js';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    ConsoleOutput.section('СПРАВКА ПО КОМАНДАМ');

    ConsoleOutput.info('Программа для подготовки данных для REST API сервера');

    console.log(`\n📋 ${ ConsoleOutput.highlightCommand('Доступные команды:') }\n`);

    ConsoleOutput.log(`${ConsoleOutput.highlightCommand('--version')}                   выводит номер версии приложения`);
    ConsoleOutput.log(`${ConsoleOutput.highlightCommand('--help')}                      показывает эту справку`);
    ConsoleOutput.log(`${ConsoleOutput.highlightCommand('--import')} ${ConsoleOutput.highlightFile('<path>')}             импортирует данные из TSV файла`);
    ConsoleOutput.log(`${ConsoleOutput.highlightCommand('--generate')} ${ConsoleOutput.highlightNumber('<n>')} ${ConsoleOutput.highlightFile('<path>')} ${ConsoleOutput.highlightFile('<url>')}  генерирует тестовые данные`);

    console.log(`\n💡 ${ ConsoleOutput.highlightCommand('Примеры использования:') }\n`);

    ConsoleOutput.log(`npm run cli -- ${ConsoleOutput.highlightCommand('--version')}`);
    ConsoleOutput.log(`npm run cli -- ${ConsoleOutput.highlightCommand('--import')} ${ConsoleOutput.highlightFile('./mocks/test-data.tsv')}`);
    ConsoleOutput.log(`npm run cli -- ${ConsoleOutput.highlightCommand('--generate')} ${ConsoleOutput.highlightNumber('10')} ${ConsoleOutput.highlightFile('./data.tsv')} ${ConsoleOutput.highlightFile('http://localhost:3123/api')}`);

    console.log('');
  }
}
