// TypeScript definitions for "@augu/logging"
// Project: https://github.com/auguwu/logging
// Definitions by:
//    - August <august@augu.dev>

declare module '@augu/logging' {
  import { Collection } from '@augu/immutable';
  import { Writable } from 'stream';

  namespace Logging {
    /** Returns the version of the library */
    export const version: string;

    /**
     * Simple way of creating a Logger instance
     * @param ns The namespace of the logger
     * @param options Any additional options (use this if you want the file transport to be added)
     */
    export function createLogger(ns: string, options?: CreateLoggerOptions): Logging.Logger;

    /** The log levels used */
    enum LogLevel {
      Error = 'error',
      Debug = 'debug',
      Fatal = 'fatal',
      Warn = 'warn',
      Info = 'info'
    }

    type OrchidBinding = (level: 'error' | 'warn' | 'info', message: string) => string;
    type Formatter = string | ((level: LogLevel, message: string) => string);

    interface CreateLoggerOptions {
      format?: Formatter;
      file?: string;
    }

    interface LogOptions {
      /** Any transports to add */
      transports: BaseTransport[];
    
      /** The global format itself */
      format?: Formatter;
    }

    class TransportCollection extends Collection<BaseTransport> {
      /**
       * Gets the console transport
       */
      get(key: 'console'): Logging.ConsoleTransport;

      /**
       * Gets the file transport
       */
      get(key: 'file'): Logging.FileTransport;
    }

    export class Logger {
      /** The list of the injected transports */
      public transports: TransportCollection;

      /** The logger's namespace */
      public namespace: string;

      /** The global format syntax */
      public formatter: Formatter;

      /**
       * Creates a new instance of the Logger
       * @param namespace The namespace of the Logger
       * @param options Any options
       */
      constructor(namespace: string, options: LogOptions);

      /**
       * Prints as `INFO`
       * @param messages The message(s) to send
       */
      info(...messages: any[]): void;

      /**
       * Prints as `WARN`
       * @param messages The message(s) to send
       */
      warn(...messages: any[]): void;

      /**
       * Prints as `DEBUG`
       * @param messages The message(s) to send
       */
      debug(...messages: any[]): void;

      /**
       * Prints as `ERROR`
       * @param messages The message(s) to send
       */
      error(...messages: any[]): void;

      /**
       * Prints as `FATAL`
       * @param messages The message(s) to send
       */
      fatal(...messages: any[]): void;

      /**
       * Bind `@augu/orchid`'s Logger middleware to this instance
       * 
       * @example
       * const http = new orchid.HttpClient();
       * http.use(orchid.middleware.logging({ binding: logger.orchid }))
       */
      get orchid(): OrchidBinding;
    }

    export abstract class BaseTransport {
      /** The logger itself */
      public core: Logger;
    
      /** The name of the transport */
      public abstract name: string;
    
      /**
       * Injects the Logger into this transport
       */
      inject(core: Logger): void;
    
      /**
       * Print it out
       */
      public abstract print(message: string): void;
    }

    export class ConsoleTransport extends BaseTransport {
      public name: string;
      public print(message: string): void;
    }

    export class FileTransport extends BaseTransport {
      constructor(filepath: string);

      public file: Writable;
      public name: string;
      public print(message: string): void;
    }
  }
  
  export = Logging;
}