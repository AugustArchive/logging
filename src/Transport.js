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

/**
 * Represents a base class that is a transport
 * for sending messages with the Logger API.
 *
 * @abstract Method `Transport.write` needs to be abstracted
 * into the transport itself or it'll error out.
 *
 * ### **Default Transports**
 * - [ConsoleTransport] (injected by default)
 * - [FileTransport]
 */
module.exports = class Transport {
  /**
   * Creates a new [Transport] instance
   * @param {string} name The name of the transport
   */
  constructor(name) {
    if (typeof name !== 'string') throw new TypeError(`\`name\` was not a String, received ${typeof name}`);

    /**
     * The name of the transport
     * @type {string}
     */
    this.name = name;
  }

  /**
   * Writes a message to this [Transport] instance
   * @param {string} message The formatted message
   */
  write(message) {
    throw new SyntaxError(`Transport \`${this.name}\` is missing the "write" method.`);
  }

  toString() {
    return `[Transport (${this.name})]`;
  }
};
