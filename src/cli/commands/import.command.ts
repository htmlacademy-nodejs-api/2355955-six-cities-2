import { ConsoleOutput } from '../../shared/helpers/index.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';


export class ImportCommand implements Command {
  getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    ConsoleOutput.data('Импортированное предложение', offer);
  }

  private onCompleteImport(count: number) {
    ConsoleOutput.success(`Импортировано ${ConsoleOutput.highlightNumber(count)} строк данных`);
  }

  async execute(...parameters: string[]) {
    const [fileName] = parameters;
    const fileReader = new TSVFileReader(fileName.trim());

    ConsoleOutput.section('ИМПОРТ ДАННЫХ');
    ConsoleOutput.info(`Начинаю импорт данных из файла ${ConsoleOutput.highlightFile(fileName.trim())}`);

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      ConsoleOutput.progress('Читаю файл...');
      await fileReader.read();
    } catch (error) {
      ConsoleOutput.error(error instanceof Error ? error.message : String(error));
      ConsoleOutput.error(`Не удалось прочитать файл: ${ConsoleOutput.highlightFile(fileName)}`);
    }
  }

}
