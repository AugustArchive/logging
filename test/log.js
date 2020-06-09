const { createLogger } = require('../build');

const logger = createLogger('Suite #1', {
  //format: '{level} | {message}',
  file: './logs/suite.log'
});

logger.info('Test');
logger.debug('Test');
logger.warn('Test');
logger.error('Test');
logger.fatal('Test');