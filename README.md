# @augu/logging
> :space_invader: **| Make logging pretty :sparkles:**

![Example](https://cdn.augu.dev/logger.png)

## Notice
This package is deprecated and stored for historical purporses, please use [signale](https://npmjs.com/package/signale)!

## Usage
```ts
import { Logger, ConsoleTransport } from '@augu/logging';

const logger = new Logger('Namespace', {
  transports: [new ConsoleTransport()],
  format: '[{date}] {level} <=> {message}'
});

logger.info('Test');
```

## License
**@augu/logging** is released under the MIT License. Read [here](/LICENSE) for more information.