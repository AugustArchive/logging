# @augu/logging
![Workflow Status](https://github.com/auguwu/logging/workflows/ESLint/badge.svg)

> :space_invader: **Make logging pretty and robust :sparkles:**

![](https://cdn.floofy.dev/logger.png)

## Usage
```js
const { createLogger, FileTransport } = require('@augu/logging');
const logger = createLogger({
  namespace: 'Namespace',
  transports: [FileTransport], // constructor that can be used with `new` or a new instance
  levels: [
    {
      level: 'debug',
      color: '' // hex, hsl, rgb, number
    }
  ]
});

logger.info('Test!');
```

## License
**@augu/logging** is released under the MIT License. Read [here](/LICENSE) for more information.
