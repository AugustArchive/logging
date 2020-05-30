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

    interface LogOptions {
      /** Any transports to add */
      transports: BaseTransport[];
    
      /** The global format itself */
      format?: Formatter;
    }

    export class Logger {
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
      constructor(namespace: string, options: LogOptions);
      info(...messages: any[]): void;
      warn(...messages: any[]): void;
      debug(...messages: any[]): void;
      error(...messages: any[]): void;
      fatal(...messages: any[]): void;
      orchid(): OrchidBinding;
    }

    abstract class BaseTransport {
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