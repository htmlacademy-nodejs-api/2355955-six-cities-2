import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { ConsoleOutput } from '../../helpers/index.js';
import { FileReader } from './file-reader.interface.js';

const CHUNK_SIZE = 16384; // 16KB
export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }


  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      // Отладочная информация только при наличии переменной окружения DEBUG
      if (process.env.DEBUG) {
        ConsoleOutput.log(`Получен фрагмент данных: ${ConsoleOutput.highlightNumber(chunk.length)} символов`);
        ConsoleOutput.data('Содержимое буфера', remainingData.substring(0, 100) + (remainingData.length > 100 ? '...' : ''));
      }

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        this.emit('line', completeRow);
      }
    }

    this.emit('end', importedRowCount);
  }

  // private async readByStreamEvents(): Promise<void> {
  //   const readStream = createReadStream(this.filename, {
  //     highWaterMark: CHUNK_SIZE,
  //     encoding: 'utf-8',
  //   });

  //   let remainingData = '';
  //   let nextLinePosition = -1;
  //   let importedRowCount = 0;

  //   readStream.on('readable', async () => {
  //     const chunk = readStream.read();
  //     remainingData += chunk.toString();

  //     while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
  //       const completeRow = remainingData.slice(0, nextLinePosition + 1);
  //       remainingData = remainingData.slice(++nextLinePosition);
  //       importedRowCount++;

  //       this.emit('line', completeRow);
  //     }

  //     this.emit('end', importedRowCount);
  //   });

  // }
}
