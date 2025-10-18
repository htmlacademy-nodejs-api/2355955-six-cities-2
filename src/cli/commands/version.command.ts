import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import { Logger } from '../../shared/helpers/index.js';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );

}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = './package.json'
  ) {
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      Logger.section('ИНФОРМАЦИЯ О ВЕРСИИ');
      const version = this.readVersion();
      Logger.success(`Текущая версия приложения: ${Logger.highlightNumber(version)}`);
      Logger.info(`Файл конфигурации: ${Logger.highlightFile(this.filePath)}`);
    } catch (error: unknown) {
      Logger.error(`Не удалось прочитать версию из файла ${Logger.highlightFile(this.filePath)}`);

      if (error instanceof Error) {
        Logger.error(error.message);
      }
    }
  }
}
