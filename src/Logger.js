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

const ConsoleTransport = require('./transports/ConsoleTransport');
const { Collection } = require('@augu/immutable');
const emoji = require('node-emoji');
const merge = require('./util/merge');
const leeks = require('leeks.js');

/**
 * Represents a [Logger] class, which inherits the possibly
 * of creating beautiful logging in your project, maybe? ✨
 */
module.exports = class Logger {
  /**
   * Creates a new [Logger] object instance
   * @param {Options} [options] The options to use
   */
  constructor(options) {
    options = merge(options, {
      transports: [ConsoleTransport],
      namespace: 'Logger',
      levels: []
    });

    this.constructor._validate(options);

    /**
     * The transports list
     * @type {Collection<Transport>}
     */
    this.transports = new Collection();

    /**
     * The namespace of the logger
     * @type {string}
     */
    this.namespace = options.namespace;

    for (let i = 0; i < options.transports.length; i++) {
      const klazz = options.transports[i];
      const transport = new klazz();

      this.transports.set(transport.name, transport);
    }

    for (let i = 0; i < options.levels.length; i++) {
      const level = levels[i];
      this[name || Logger.toLevel(level.name)] = (...messages) => this.writeCustom(level, ...messages);
    }
  }

  /**
   * Statically validate the options
   * @param {Options} opts The options to validate
   */
  static _validate(opts) {
    if (typeof opts !== 'object' && !Array.isArray(opts)) throw new TypeError(`Expecting \`object\`, but received ${typeof opts === 'object' ? 'array' : typeof opts}`);
    if (Object.keys(opts).length === 0) throw new TypeError('Missing options, please add some!');
    if (!opts.namespace) throw new TypeError('Missing required option: "namespace"');

    if (opts.transports && !Array.isArray(opts.transports)) throw new TypeError(`\`transports\` was not an Array, received ${typeof opts.transports}`);
    if (opts.levels && !Array.isArray(opts.levels)) throw new TypeError(`\`levels\` was not an Array, received ${typeof opts.levels}`);
    if (typeof opts.namespace !== 'string') throw new TypeError(`\`namespace\` was not a String, received ${typeof opts.namespace}`);
  }

  /**
   * Remove any spaces and replaces it
   * @param {string} text The text to replace
   */
  static toLevel(text) {
    if (typeof text !== 'string') text = String(text);

    return text
      .replace(/\s|\n|\r|\t/g, '')
      .trim();
  }
};

/**
 * @typedef {object} Options
 * @prop {Inherit<import('./Transport')>} [transports] The list of transports to use
 * @prop {{ [x: string]: string | number | number[] }[]} [levels] Any custom levels to add
 * @prop {string} namespace The namespace of the logger
 */

/**
 * @typedef {new (...args: any[]) => T} Inherit
 * @template T
 */
