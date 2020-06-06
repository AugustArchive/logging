const { Logger, ConsoleTransport, FileTransport } = require('../build');

const logger = new Logger('Test', {
  transports: [new ConsoleTransport(), new FileTransport('./logs/test.log')],
  //format: '[{level}] <=> {message}'
});

//logger.orchid();

logger.info('Test');
logger.debug('Test');
logger.warn('Test');
logger.error('Test');
logger.fatal('Test');