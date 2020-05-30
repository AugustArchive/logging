# @augu/logging
> :space_invader: **| Make logging pretty :sparkles:**

![Example](https://cdn.augu.dev/logger.png)

## Usage
```ts
import { Logger, ConsoleTransport } from '@augu/logging';

const logger = new Logger('Namespace', {
  transports: [new ConsoleTransport()],
  format: '[{date}] {level} <=> {message}'
});

logger.info('Test');
```