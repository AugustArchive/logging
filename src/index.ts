import Logger, { Formatter } from './Logger';
import ConsoleTransport from './transports/ConsoleTransport';
import FileTransport from './transports/FileTransport';
import BaseTransport from './transports/BaseTransport';
import getOption from './util/options';

export const version: string = require('../package.json').version;
export { Logger, ConsoleTransport, FileTransport, BaseTransport };

interface LogOptions {
  format?: Formatter;
  file?: string;
}

export function createLogger(ns: string, options?: LogOptions) {
  const transports: BaseTransport[] = [new ConsoleTransport()];
  const useFile = getOption<string | null>('file', null, options);

  if (useFile != null) transports.push(new FileTransport(useFile)); // eslint-disable-line
  const opts = { transports };

  const formatter = getOption<Formatter | undefined>('format', undefined, options);
  if (formatter != undefined) opts['format'] = formatter; // eslint-disable-line

  return new Logger(ns, opts);
}
