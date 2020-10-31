import { createWriteStream, mkdirSync } from 'fs';
import type { Writable } from 'stream';
import BaseTransport from './BaseTransport';

const strip = (message: string) => message.replace(/\u001b\[.*?m/g, '');

// Credit: https://github.com/PassTheWessel/pikmin/blob/master/lib/pikmin/transports/File.js
function getWriteStream(file: string) {
  if (/\/\//.test(file)) {
    let previous = './';
    const chunks = file.split('//').slice(0, -1);

    for (const chunk of chunks) {
      try {
        mkdirSync(`${previous}/${chunk}`);
      } catch {
        // ignore
      }

      previous = `${previous}/${chunk}`;
    }
  }

  if (/\//.test(file)) {
    let previous = './';
    const chunks = file.split('/').slice(0, -1);

    for (const chunk of chunks) {
      try {
        mkdirSync(`${previous}/${chunk}`);
      } catch {
        // ignore
      }

      previous = `${previous}/${chunk}`;
    }
  }

  try {
    return createWriteStream(file);
  } catch {
    return null;
  }
}

export default class FileTransport extends BaseTransport {
  /** The file itself */
  public file: Writable;

  /**
   * Constructs a new instance of the file transport
   * @param path The filepath
   */
  constructor(path: string) {
    super();

    const stream = getWriteStream(path);
    if (stream === null) throw new Error('Unable to make a writable stream');

    // Creates an empty file
    this.file = stream;
  }

  get name() {
    return 'file';
  }

  print(message: string) {
    this.file.write(`${strip(message)}\n`);
  }
}
