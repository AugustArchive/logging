import Logger from '../Logger';

/**
 * The base transport, how all the transports will be
 */
export default abstract class BaseTransport {
  /** The logger itself */
  public core!: Logger;

  /** The name of the transport */
  public abstract name: string;

  /**
   * Injects the Logger into this transport
   */
  inject(core: Logger) {
    this.core = core;
    return this;
  }

  /**
   * Print it out
   */
  public abstract print(message: string): void;
}
