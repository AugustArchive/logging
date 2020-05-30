import type { Writable } from 'stream';
import { createWriteStream } from 'fs';
import BaseTransport from './BaseTransport';

const strip = (message: string) => message.replace(/\u001b\[.*?m/g, '');

export default class FileTransport extends BaseTransport {
  /** The file itself */
  public file: Writable;

  /**
   * Constructs a new instance of the file transport
   * @param path The filepath
   */
  constructor(path: string) {
    super();

    // Creates an empty file
    this.file = createWriteStream(path);
    this.addEvents();
  }

  get name() {
    return 'file';
  }

  print(message: string) {
    this.file.write(`${strip(message)}\n`);
  }

  private addEvents() {
    process.on('exit', () => {
      this.file.end();
    });
  }
}