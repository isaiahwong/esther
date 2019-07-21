# Esther
An opinionated winston logger wrapper.  
`Requires nodejs 10.11 > as it utilises grpc lib`

# Usage
The recommended way to use `esther` is setup the logger with `logger.init` function.
This instantiates a new instance of `winston` with your own settings under the hood.
```
const logger = require('esther');

// Initialise logger
logger.init({
  useFileTransport: true,
  logDirectory: path.join(__dirname, '..', 'logs'),
});
```
You may also use `esther` via the default logger exposed by `require('esther')`
This works with `ES6` syntax such as `import`.

`init` Options are identical with `winston` configs.   

| Name          | Default                     |  Description    |  
| ------------- | --------------------------- | --------------- |
| `level`       | `'info'`      | Log only if `verbose` is less than or equal to this level |
| `levels`      | `esther.config.levels`      | Levels representing log priorities |  
| `colors`      | `esther.config.colors`      | colors representing log priorities |  
| `disableStackTrace`      | `false`      | Disable logging of stack trace for `isHandledError`. I.E `logger.error(new Error(), { isHandledError: true });` [Example](#disable-stack-trace) |  
| `transports`  | `[]` _(Console Transport)_  | Set of logging targets for logs |  
| `useFileTransport` | `false` | If true, will generate and write logs to system  |  
| `logDirectory` | `Root directory of project` (__dirname) | Logs directory to be written to |  
| `useStackDriver` | `false` | If true, logger transport will utilise google's `StackDriver`.  |  
| `stackDriverOpt` | `{ serviceName: 'Auth service', ver: '1.0,0' }` | Adds labels to each logging |  

Refer to [Stackdriver][google-winston] docs on how to setup your google service account. Alternatively, if you're deploying your app with `kubernetes` on `GKE`, each pod is configured with the `default` service account

# Disable Stack Trace
```
import { BadRequest } from 'horeb';
import path from 'path';
import logger from 'esther';

logger.init({
  disableStackTrace: true,
  useFileTransport: true,
  logDirectory: path.join(__dirname, 'logs'),
});
const err = new BadRequest('invalid parameters');
logger.error(err, { isHandledError: true });
// Prints out message only
```

# TODO
Parameterized options

[google-winston]: https://github.com/googleapis/nodejs-logging-winston#readme
