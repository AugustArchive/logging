const { createLogger, FileTransport } = require('../src');
const logger = createLogger({
  namespace: 'Suite #1',
  transports: [new FileTransport('./a.log')],
  levels: {
    trace: 'red'
  }
});

logger.info(':sparkles: Beep boop, I am your personal robot for today.');
logger.error(':x: Uh oh... I broke something', new Error('Database "logging" doesn\'t exist'));
logger.warn(':pencil2: Seeing over 1.3 million requests in a single minute, seems odd...');
logger.debug({ userID: 'auguwu', createdAt: new Date().toUTCString(), description: 'Some idiot online making stuff!', age: 16 });
logger.trace('seems sus ngl... :coffee:');
