
import { Logger } from '../../shared/helpers/index.js';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    Logger.section('СПРАВКА ПО КОМАНДАМ');

    Logger.info('Программа для подготовки данных для REST API сервера');

    console.log(`\n📋 ${ Logger.highlightCommand('Доступные команды:') }\n`);

    Logger.log(`${Logger.highlightCommand('--version')}                   выводит номер версии приложения`);
    Logger.log(`${Logger.highlightCommand('--help')}                      показывает эту справку`);
    Logger.log(`${Logger.highlightCommand('--import')} ${Logger.highlightFile('<path>')}             импортирует данные из TSV файла`);
    Logger.log(`${Logger.highlightCommand('--generate')} ${Logger.highlightNumber('<n>')} ${Logger.highlightFile('<path>')} ${Logger.highlightFile('<url>')}  генерирует тестовые данные`);

    console.log(`\n💡 ${ Logger.highlightCommand('Примеры использования:') }\n`);

    Logger.log(`npm run cli -- ${Logger.highlightCommand('--version')}`);
    Logger.log(`npm run cli -- ${Logger.highlightCommand('--import')} ${Logger.highlightFile('./mocks/test-data.tsv')}`);
    Logger.log(`npm run cli -- ${Logger.highlightCommand('--generate')} ${Logger.highlightNumber('10')} ${Logger.highlightFile('./data.tsv')} ${Logger.highlightFile('http://localhost:3123/api')}`);

    console.log('');
  }
}
