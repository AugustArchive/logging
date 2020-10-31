// TypeScript definitions for "@augu/logging"
// Project: https://github.com/auguwu/logging
// Definitions by:
//    - August <august@augu.dev>

declare module '@augu/logging' {
  import { Colors as colors } from 'leeks.js';
  import { Collection } from '@augu/immutable';

  namespace logging {
    type InheritClass<T> = new (...args: any[]) => T;
    interface Options {
      transports?: Transport[];
      namespace: string;
      levels?: Record<string, string | number[] | colors>;
    }

    export const version: string;
    export function createLogger<L extends string = logging.DefaultTypes>(options?: logging.Options): logging.ILogger<L>;
    export const FileTransport: InheritClass<Transport>;

    export abstract class Transport {
      constructor(name: string);

      public name: string;
      public abstract write(message: string): void;
    }

    class InheritLogger {
      constructor(options?: logging.Options);

      public transports: Collection<Transport>;
    }

    type DefaultTypes = 'info' | 'error' | 'warn' | 'debug';
    type LogMessage = string | any[] | object | Error | Date;
    type LogFunc = (...messages: LogMessage[]) => void;
    type ILogger<L extends string> = InheritLogger & Record<L, LogFunc> & Record<logging.DefaultTypes, LogFunc>;

    export const Logger: new (options?: logging.Options) => logging.ILogger<DefaultTypes>;
  }

  export = logging;
}
