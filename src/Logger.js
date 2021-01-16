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
const { inspect } = require('util');
const emoji = require('node-emoji');
const leeks = require('leeks.js');

const Months = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sept',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
};


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
    this.constructor._validate(options);

    options.levels = {
      debug: 'cyan',
      error: 'red',
      warn: 'yellow',
      info: 'cyan',
      ...options.levels
    };

    /**
     * The transports list
     * @type {Collection<import('./Transport')>}
     */
    this.transports = new Collection();

    /**
     * The namespace of the logger
     * @type {string}
     */
    this.namespace = options.namespace;

    this.transports.set('console', new ConsoleTransport());
    for (let i = 0; i < options.transports.length; i++) {
      const transport = options.transports[i];
      this.transports.set(transport.name, transport);
    }

    const levels = Object.entries(options.levels);
    for (let i = 0; i < levels.length; i++) {
      const [name, color] = levels[i];
      this[name || Logger.toLevel(name)] = (...messages) => this.write({ name, color }, ...messages);
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
    if (opts.levels && (typeof opts.levels !== 'object' || Array.isArray(opts.levels))) throw new TypeError(`\`levels\` was not an Object, received ${typeof opts.levels === 'object' ? 'array' : typeof opts.levels}`);
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

  /**
   * Formats the message to a readable format
   * @param {...LogMessage} messages The messages to format
   * @returns {string} The formatted message
   */
  formatMessages(...messages) {
    /**
     * Inner function to return the actual prettified message
     * @param {LogMessage} msg The message
     * @returns {string} The formatted message
     */
    function format(msg) {
      if (msg instanceof Date) return msg.toUTCString();
      if (msg instanceof Array) return `[${msg.map(format).join(', ')}]`;
      if (msg instanceof Error) {
        const e = [`${msg.name}: ${msg.message}`];
        const stack = msg.stack ? msg.stack.split('\n').map(s => s.trim()) : [];
        stack.shift();

        const all = stack.map(s => {
          if (/(.+(?=)|.+) ((.+):\d+|[:\d+])[)]/g.test(s)) return s.match(/(.+(?=)|.+) ((.+):\d+|[:\d+])[)]/g)[0];
          if (/(.+):\d+|[:\d+][)]/g.test(s)) return s.match(/(.+):\d+|[:\d+][)]/g)[0];

          return s;
        });

        e.push(...all.map(item => `   • in "${item.replace('at', '').trim()}"`));
        return e.join('\n');
      }

      if (typeof msg === 'object' && !Array.isArray(msg)) return inspect(msg, { depth: 2 });

      return msg;
    }

    return messages.map(item => format(item)).join('\n');
  }

  /**
   * Gets the color function of the level
   * @private
   * @param {LogLevel} level The level to use
   */
  getColorOfLevel(level) {
    if (Array.isArray(level.color) && level.color.some(s => typeof s === 'number' && !Number.isNaN(Number(s)))) return leeks.rgbBg(level.color, `[${level.name}]`);
    if (typeof level.color === 'string') {
      const all = Object.keys(leeks.colors);

      if (all.includes(level.color)) return leeks.colors[level.color](`[${level.name}]`);
      if (/^#[0-9a-fA-F]+$/.test(level.color)) return leeks.hex(level.color, `[${level.name}]`);
    }

    throw new TypeError(`Expected \`string\` or \`number (array)\`, but received ${typeof level.color === 'object' ? 'array' : typeof level.color}`);
  }

  /**
   * Gets the current date
   */
  getDate() {
    const now = new Date();
    const esc = (type) => `0${type}`.slice(-2);

    const month = Months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    /**
     * Find the number's ordinal suffix
     * @param {number} i The number to find
     */
    function findOrdinal(i) {
      const j = i % 10;
      const k = i % 100;

      /* eslint-disable eqeqeq */
      if (j == 1 && k != 11) return 'st';
      if (j == 2 && k != 12) return 'nd';
      if (j == 3 && k != 13) return 'rd';
      /* eslint-enable eqeqeq */

      return 'th';
    }

    return `[${month} ${date}${findOrdinal(date)}, ${year} | ${esc(now.getHours())}:${esc(now.getMinutes())}:${esc(now.getSeconds())}]`;
  }

  /**
   * Writes a level to the console
   * @param {LogLevel} level The level to use
   * @param {...LogMessage} messages Any messages to format
   */
  write(level, ...messages) {
    const message = this.formatMessages(...messages);
    const color = this.getColorOfLevel(level);
    const date = this.getDate();

    const c = emoji.emojify(message, undefined, (code) => code + '  ');
    for (const transport of this.transports.values()) transport.write(`${leeks.colors.gray(date)} ${leeks.hex('#FFB9BE', `[${this.namespace}]`)} ${color}  ${c}`);
  }
};

/**
 * @typedef {string | any[] | Object<string, any> | Error} LogMessage
 * @typedef {object} Options
 * @prop {Inherit<import('./Transport')>} [transports] The list of transports to use
 * @prop {{ [x: string]: string | number | number[] }} [levels] Any custom levels to add
 * @prop {string} namespace The namespace of the logger
 *
 * @typedef {object} LogLevel
 * @prop {string | number[]} color
 * @prop {string} name
 */

/**
 * @typedef {new (...args: any[]) => T} Inherit
 * @template T
 */
