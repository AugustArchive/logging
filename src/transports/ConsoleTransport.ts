import BaseTransport from './BaseTransport';

export default class ConsoleTransport extends BaseTransport {
  get name() {
    return 'console';
  }

  print(message: string) {
    process.stdout.write(`${message}\n`);
  }
}
