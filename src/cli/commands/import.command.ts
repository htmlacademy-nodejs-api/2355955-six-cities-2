import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/file-reader/index.js';

export class ImportCommand implements Command {
  getName(): string {
    return '--import';
  }

  execute(...parameters: string[]) {
    const [fileName] = parameters;
    const fileReader = new TsvFileReader(fileName.trim());

    try {
      fileReader.read();
      console.log('fileReader.toArray()', fileReader.toArray());

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      console.error(`Could not read file: ${fileName}`);
    }
  }
}
