import got from 'got';
import { ConsoleOutput } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { MockServerData } from '../../shared/types/mock-server-data.type.js';
import { Command } from './command.interface.js';
export class GenerateCommand implements Command {
  private initialData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  private async loadInitialData(url: string) {
    try {
      ConsoleOutput.progress(`Загружаю данные с сервера ${ConsoleOutput.highlightFile(url)}`);
      this.initialData = await got.get(url).json();
      ConsoleOutput.success('Данные успешно загружены с сервера');
    } catch {
      throw new Error(`Не удалось загрузить данные с ${url}`);
    }
  }


  private async write(filePath: string, count:number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const fileWriter = new TSVFileWriter(filePath);

    ConsoleOutput.progress(`Генерирую ${ConsoleOutput.highlightNumber(count)} записей в файл ${ConsoleOutput.highlightFile(filePath)}`);

    for (let i = 0; i < count; i++) {
      await fileWriter.write(tsvOfferGenerator.generate());

      // Показываем прогресс каждые 10% или при малом количестве записей
      if (count >= 10 && (i + 1) % Math.ceil(count / 10) === 0) {
        const progress = Math.round(((i + 1) / count) * 100);
        ConsoleOutput.log(`Прогресс: ${ConsoleOutput.highlightNumber(progress)}% (${ConsoleOutput.highlightNumber(i + 1)}/${ConsoleOutput.highlightNumber(count)})`);
      }
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    ConsoleOutput.section('ГЕНЕРАЦИЯ ДАННЫХ');
    ConsoleOutput.info(`Генерация ${ConsoleOutput.highlightNumber(offerCount)} тестовых записей`);

    try {
      await this.loadInitialData(url);
      await this.write(filepath, offerCount);

      ConsoleOutput.success(`Файл ${ConsoleOutput.highlightFile(filepath)} успешно создан!`);
    } catch (error: unknown) {
      ConsoleOutput.error('Не удалось сгенерировать данные');

      if (error instanceof Error) {
        ConsoleOutput.error(error.message);
      } else {
        ConsoleOutput.error(String(error));
      }
    }
  }
}
