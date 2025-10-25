import { Logger } from '../../shared/helpers/index.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';


export class ImportCommand implements Command {
  getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    Logger.data('Импортированное предложение', offer);
  }

  private onCompleteImport(count: number) {
    Logger.success(`Импортировано ${Logger.highlightNumber(count)} строк данных`);
  }

  async execute(...parameters: string[]) {
    const [fileName] = parameters;
    const fileReader = new TSVFileReader(fileName.trim());

    Logger.section('ИМПОРТ ДАННЫХ');
    Logger.info(`Начинаю импорт данных из файла ${Logger.highlightFile(fileName.trim())}`);

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      Logger.progress('Читаю файл...');
      await fileReader.read();
    } catch (error) {
      Logger.error(error instanceof Error ? error.message : String(error));
      Logger.error(`Не удалось прочитать файл: ${Logger.highlightFile(fileName)}`);
    }
  }

}
