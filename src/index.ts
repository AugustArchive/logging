import ConsoleTransport from './transports/ConsoleTransport';
import FileTransport from './transports/FileTransport';
import Logger from './Logger';

export const version: string = require('../package.json').version;
export { Logger, ConsoleTransport, FileTransport };