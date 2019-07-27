/* eslint-disable class-methods-use-this */
import winston from 'winston';
import { LoggingWinston as Stackdriver } from '@google-cloud/logging-winston';
import fs from 'fs';
import path from 'path';
import { CustomError } from 'horeb';

const { format } = winston;
const colorizer = winston.format.colorize();

class Logger {
  constructor() {
    winston.addColors(this.config.colors);

    // Default logger
    this.logger = winston.createLogger({
      level: this.config.literal.verbose, // Log only if info.level less than or equal to this level
      levels: this.config.levels,
      transports: [
        this.genConsoleConfig(),
      ]
    });

    this.disableBrowser = true;
    this.disableStackTrace = false;

    // generate function definitions
    Object.keys(this.config.literal).forEach((l) => {
      Logger.prototype[l] = (...args) => {
        this.logger[l](...args);
      };
    });
  }

  static filterOnly(level) {
    const LEVEL = Symbol.for('level');
    return format((info) => {
      if (info[LEVEL] === level) {
        return info;
      }
      return null;
    })();
  }

  get config() {
    return {
      levels: {
        error: 0,
        debug: 1,
        warn: 2,
        info: 3,
        route: 4,
        verbose: 5,
        silly: 6,
      },
      colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        info: 'magenta',
        route: 'green',
        verbose: 'cyan',
        silly: 'grey',
      },
      literal: {
        error: 'error',
        debug: 'debug',
        warn: 'warn',
        info: 'info',
        route: 'route',
        verbose: 'verbose',
        silly: 'silly',
      }
    };
  }

  get fileTransports() {
    return [
      {
        file: '/info.log',
        level: 'info'
      },
      {
        file: '/route.log',
        level: 'route'
      },
      {
        file: '/warn.log',
        level: 'warn'
      },
      {
        file: '/error.log',
        level: 'error'
      },
    ].map(({ file, level }) => new winston.transports.File(
      {
        filename: path.join(this.logDirectory, file),
        level,
        format: Logger.filterOnly(level)
      })
    );
  }

  genConsoleConfig() {
    return new winston.transports.Console({
      level: 'verbose', // Log only if info.level less than or equal to this level
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.simple(),
        winston.format.printf((msg) => {
          let parsedMsg;
          if (msg.message) {
            if (typeof msg.message !== 'string') {
              parsedMsg = JSON.stringify(msg.message);
            }
            else {
              parsedMsg = msg.message;
            }
          }
          return `${colorizer.colorize('warn', `[${msg.timestamp}]`)} ${colorizer.colorize(msg.level, `${parsedMsg}`)}`;
        })
      )
    });
  }

  genStackDriver(serviceName, ver = '1.0.0') {
    return new Stackdriver({
      level: 'verbose', // Log only if info.level less than or equal to this level
      levels: this.config.levels,
      serviceContext: {
        service: serviceName,
        version: ver
      },
      labels: {
        name: serviceName,
        version: ver
      },
      prefix: serviceName
    });
  }

  /**
   * @param {Object} options
   * @param {String} option.level log only if [`info.level`]
   * @param {Object} option.levels levels representing log priorities
   * @param {Object} options.colors colors representing log priorities
   * @param {Object} options.disableStackTrace disable stack trace for handled errors
   * @param {Object} options.disableBrowser disable logger on the browser
   * @param {Object} options.transports Set of logging targets for logs
   * @param {Boolean} options.useFileTransport If true, will generate and write logs to system
   * @param {String} options.logDirectory Logs directory to be written to
   * @param {Boolean} options.useStackDriver If true, logger will use google's `StackDriver`
   * @param {Object} options.stackDriverOpt I.E: { serviceName: 'Auth service', ver: '1.0,0' }
   */
  init(options) {
    const {
      level = this.config.literal.verbose,
      levels = this.config.levels,
      colors = this.config.colors,
      // enableConsoleLogsInTest = true,
      useFileTransport = false,
      logDirectory = null,
      useStackDriver = false,
      stackDriverOpt = { serviceName: 'generic', ver: '1.0,0' },
      disableStackTrace = false,
      disableBrowser = false
    } = options;

    let { transports = [] } = options;

    if (!Array.isArray(transports)) {
      throw new CustomError('transport must be an array');
    }

    winston.addColors(colors);

    this.logDirectory = logDirectory;
    this.disableStackTrace = disableStackTrace;
    this.disableBrowser = disableBrowser;

    if (useFileTransport) {
      if (!logDirectory) {
        throw new CustomError('please provide a logDirectory');
      }
      transports = [...transports, ...this.fileTransports];
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
      }
    }

    if (useStackDriver) {
      transports = [
        ...transports,
        new winston.transports.Console(),
        this.genStackDriver(stackDriverOpt.serviceName, stackDriverOpt.ver),
      ];
    }
    else {
      transports = [
        ...transports,
        this.genConsoleConfig(),
      ];
    }

    this.logger = winston.createLogger({
      level,
      levels,
      transports
    });
  }
}

export default Logger;
