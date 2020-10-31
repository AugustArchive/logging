/**
 * Copyright (c) 2020 August
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { createWriteStream } = require('fs');
const Transport = require('../Transport');

/**
 * Strips out any colors in the message
 * @param {string} message The message to write
 */
const strip = (message) => message
  .replace(/\u001b\[.*?m/g, '');

/**
 * Creates a write stream of a file
 * @param {string} file The file to create the write stream
 * @credit [Wessel/pikmin](https://github.com/Wessel/pikmin/blob/master/lib/pikmin/transports/File.js)
 */
function getWriteStream(file) {
  if (/\/\//.test(file)) {
    let previous = './';
    const chunks = file.split('//').slice(0, -1);

    for (const chunk of chunks) {
      try {
        mkdirSync(`${previous}/${chunk}`);
      } catch(ex) {
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
      } catch(ex) {
        // ignore
      }

      previous = `${previous}/${chunk}`;
    }
  }

  return createWriteStream(file, { flags: 'a' });
}

module.exports = class FileTransport extends Transport {
  /**
   * Creates a new [FileTransport] instance
   * @param {string} path The relative path
   */
  constructor(path) {
    super('file');

    /**
     * The current writable stream to use
     * @type {NodeJS.WritableStream}
     */
    this.stream = getWriteStream(path);
  }

  write(message) {
    const escaped = strip(message);
    this.stream.write(`${escaped}\n`);
  }
};
