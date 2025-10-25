import got from 'got';
import { Logger } from '../../shared/helpers/index.js';
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
      Logger.progress(`Загружаю данные с сервера ${Logger.highlightFile(url)}`);
      this.initialData = await got.get(url).json();
      Logger.success('Данные успешно загружены с сервера');
    } catch {
      throw new Error(`Не удалось загрузить данные с ${url}`);
    }
  }


  private async write(filePath: string, count:number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const fileWriter = new TSVFileWriter(filePath);

    Logger.progress(`Генерирую ${Logger.highlightNumber(count)} записей в файл ${Logger.highlightFile(filePath)}`);

    for (let i = 0; i < count; i++) {
      await fileWriter.write(tsvOfferGenerator.generate());

      // Показываем прогресс каждые 10% или при малом количестве записей
      if (count >= 10 && (i + 1) % Math.ceil(count / 10) === 0) {
        const progress = Math.round(((i + 1) / count) * 100);
        Logger.log(`Прогресс: ${Logger.highlightNumber(progress)}% (${Logger.highlightNumber(i + 1)}/${Logger.highlightNumber(count)})`);
      }
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    Logger.section('ГЕНЕРАЦИЯ ДАННЫХ');
    Logger.info(`Генерация ${Logger.highlightNumber(offerCount)} тестовых записей`);

    try {
      await this.loadInitialData(url);
      await this.write(filepath, offerCount);

      Logger.success(`Файл ${Logger.highlightFile(filepath)} успешно создан!`);
    } catch (error: unknown) {
      Logger.error('Не удалось сгенерировать данные');

      if (error instanceof Error) {
        Logger.error(error.message);
      } else {
        Logger.error(String(error));
      }
    }
  }
}
