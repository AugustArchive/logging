import { Collection } from '@augu/immutable';
import BaseTransport from './transports/BaseTransport';
import { inspect } from 'util';
import firstUpper from './util/firstUpper';
import leeks from 'leeks.js';

/** Used for `Logger#orchid` */
type OrchidBinding = (level: 'error' | 'warn' | 'info', message: string) => string;
export type Formatter = string | ((level: LogLevel, message: string) => string);

interface LogOptions {
  /** Any transports to add */
  transports: BaseTransport[];

  /** The global format itself */
  format?: Formatter;
}

function convertOrchidLevel(level: 'error' | 'warn' | 'info'): LogLevel {
  switch (level) {
    case 'error': return LogLevel.Error;
    case 'warn': return LogLevel.Warn;
    case 'info': return LogLevel.Info;
    default: return LogLevel.Info;
  }
}

export enum LogLevel {
  Error = 'error',
  Debug = 'debug',
  Fatal = 'fatal',
  Warn = 'warn',
  Info = 'info'
}

export default class Logger {
  /** The list of the injected transports */
  public transports: Collection<BaseTransport>;

  /** The logger's namespace */
  public namespace: string;

  /** The global format syntax */
  public formatter: Formatter;

  /**
   * Creates a new instance of the Logger
   * @param namespace The namespace of the Logger
   * @param options Any options
   */
  constructor(namespace: string, options: LogOptions) {
    this.transports = new Collection();
    this.namespace = namespace;
    this.formatter = options.hasOwnProperty('format') ? options.format! : this._defaultFormatter();

    for (const transport of options.transports) {
      this.transports.set(transport.name, transport);
      transport.inject(this);
    }
  }

  // #region Private
  private _defaultFormatter(): Formatter {
    return (level, message) => {
      const date = this._getDate();
      const color = this._getLevelColor(level);

      const spacing = (length: number): string => {
        switch (length) {
          case 5: return ' ';
          case 4: return '  ';
          default: return '';
        }
      };

      return `${leeks.colors.gray(date)} ${color(`[${firstUpper(level)}${spacing(level.length)}| ${this.namespace}]`)} <=> ${message}`;
    };
  }

  private _getDate() {
    const now = new Date();
    const escape = (t: any) => `0${t}`.slice(-2);

    const hours = escape(now.getHours());
    const minutes = escape(now.getMinutes());
    const seconds = escape(now.getSeconds());
    const isAM = now.getHours() >= 12 ? 'PM' : 'AM';

    return `[${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} | ${hours}:${minutes}:${seconds} ${isAM}]`;
  }

  private _formatMessage(...messages: any[]) {
    return messages
      .map((message) =>
        message instanceof Object
          ? inspect(message)
          : Array.isArray(message)
            ? `[${message.join(', ')} (${message.length} items)]`
            : message
      )
      .join('\n');
  }

  private _getLevelColor(level: LogLevel) {
    switch (level) {
      case LogLevel.Debug: return leeks.colors.green;

      case LogLevel.Fatal:
      case LogLevel.Error: return leeks.colors.red;

      case LogLevel.Warn: return leeks.colors.yellow;
      case LogLevel.Info: return leeks.colors.blue;

      default: return leeks.colors.grey;
    }
  }

  private _write(level: LogLevel, ...messages: any[]) {
    for (const transport of this.transports.values()) transport.print(this.format(level, this.namespace, ...messages));
  }

  private format(level: LogLevel, ns?: string, ...messages: any[]) {
    if (typeof this.formatter === 'string') {
      return this
        .formatter
        .replace(/{level}/g, level)
        .replace(/{message}/g, this._formatMessage(...messages))
        .replace(/{date}/g, this._getDate())
        .replace(/{ns}/g, ns || this.namespace); // ns is for Orchid v1.2 or higher
    } else {
      return this.formatter(level, this._formatMessage(...messages));
    }
  }

  info(...messages: any[]) {
    return this._write(LogLevel.Info, ...messages);
  }

  warn(...messages: any[]) {
    return this._write(LogLevel.Warn, ...messages);
  }

  debug(...messages: any[]) {
    return this._write(LogLevel.Debug, ...messages);
  }

  error(...messages: any[]) {
    return this._write(LogLevel.Error, ...messages);
  }

  fatal(...messages: any[]) {
    return this._write(LogLevel.Fatal, ...messages);
  }

  get orchid(): OrchidBinding {
    try {
      require('@augu/orchid');
    } catch {
      throw new Error('Unable to find @augu/orchid, did you install it?');
    }

    const orchid = require('@augu/orchid');
    if (Number(orchid.version.split('.')[1]) < 2) {
      return ((level: 'info' | 'error' | 'warn', message: string) => {
        return this.format(convertOrchidLevel(level), this.namespace, message);
      }) as any;
    } else {
      return ((ns: string, level: 'info' | 'error' | 'warn', message: string) => {
        return this.format(convertOrchidLevel(level), ns, message);
      }) as any;
    }
  }
}
