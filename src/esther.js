import { CustomError } from 'horeb';
import { omit, isPlainObject } from 'lodash';
import Logger from './libs/logger';

const logger = new Logger();

// Logger interface
const esther = {
  config: logger.config,

  /**
   * @param {Object} options
   * @param {String} option.level log only if [`info.level`]
   * @param {Object} option.levels levels representing log priorities
   * @param {Object} options.colors colors representing log priorities
   * @param {Object} options.transports Set of logging targets for logs
   * @param {Boolean} options.useFileTransport If true, will generate and write logs to system
   * @param {String} options.logDirectory Logs directory to be written to
   * @param {Boolean} options.useStackDriver If true, logger will use google's `StackDriver`
   * @param {Object} options.stackDriverOpt I.E: { serviceName: 'Auth service', ver: '1.0,0' }
   */
  init(options) {
    logger.init(options);
  },

  silly(...args) {
    logger.silly(...args);
  },

  verbose(...args) {
    logger.verbose(...args);
  },

  route(...args) {
    logger.route(...args);
  },

  info(...args) {
    logger.info(...args);
  },

  warn(...args) {
    logger.warn(...args);
  },

  debug(...args) {
    logger.debug(...args);
  },

  // Accepts two argument,
  // an Error object (required)
  // and an object of additional data to log alongside the error
  // If the first argument isn't an Error, it'll call logger.error with all the arguments supplied
  error(...args) {
    const [err, errorData = {}, ...otherArgs] = args;

    if (err instanceof Error) {
      // pass the error stack as the first parameter to logger.error
      const stack = err.stack || err.message || err;

      if (isPlainObject(errorData) && !errorData.fullError) {
        // If the error object has interesting data (not only httpCode,
        // message and name from the CustomError class)
        // add it to the logs
        if (err instanceof CustomError) {
          const errWithoutCommonProps = omit(err, ['name', 'httpCode', 'message']);

          if (Object.keys(errWithoutCommonProps).length > 0) {
            errorData.fullError = errWithoutCommonProps;
          }
        }
        else {
          errorData.fullError = err;
        }
      }

      const loggerArgs = [stack, errorData, ...otherArgs];

      // Treat 4xx errors that are handled as warnings, 5xx and uncaught errors as serious problems
      if (!errorData || !errorData.isHandledError || errorData.httpCode >= 500) {
        logger.error(...loggerArgs);
      }
      else {
        logger.verbose(...loggerArgs); // Ignore 4xx
      }
    }
    else {
      logger.error(...args);
    }
  },
};

export default esther;
