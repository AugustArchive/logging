import type { ConsoleTransport, FileTransport } from '..';
import { Collection } from '@augu/immutable';
import type Base from '../transports/BaseTransport';

export default class TransportCollection extends Collection<Base> {
  get(key: 'console'): ConsoleTransport;
  get(key: 'file'): FileTransport;
  get(key: string | number) {
    return super.get(key);
  }
}
