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
 * Merges a given object with a default object if
 * properties don't exist.
 *
 * @template T The data object
 * @param {T} obj The object to merge
 * @param {T} defaults The default object to merge
 * @returns {NonNullableObject<T>} The object that is merged
 */
module.exports = function merge(obj, defaults) {
  if (!obj) return defaults;

  for (const key in obj) {
    if (!Object.hasOwnProperty.call(obj, key) || obj[key] === undefined) obj[key] = defaults[key];
    else if (obj[key] === Object(obj[key])) obj[key] = merge(defaults[key], obj[key]);
  }

  return obj;
};

/**
 * @typedef {{ [P in keyof T]: NonNullable<T[P]>; }} NonNullableObject
 * @template T
 */
