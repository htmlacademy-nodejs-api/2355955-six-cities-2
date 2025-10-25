import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConsoleOutput } from '../../shared/helpers/index.js';
import { Command } from './command.interface.js';

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
      ConsoleOutput.section('ИНФОРМАЦИЯ О ВЕРСИИ');
      const version = this.readVersion();
      ConsoleOutput.success(`Текущая версия приложения: ${ConsoleOutput.highlightNumber(version)}`);
      ConsoleOutput.info(`Файл конфигурации: ${ConsoleOutput.highlightFile(this.filePath)}`);
    } catch (error: unknown) {
      ConsoleOutput.error(`Не удалось прочитать версию из файла ${ConsoleOutput.highlightFile(this.filePath)}`);

      if (error instanceof Error) {
        ConsoleOutput.error(error.message);
      }
    }
  }
}
