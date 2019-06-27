export const config: {
    colors: {
        debug: string;
        error: string;
        info: string;
        route: string;
        silly: string;
        verbose: string;
        warn: string;
    };
    levels: {
        debug: number;
        error: number;
        info: number;
        route: number;
        silly: number;
        verbose: number;
        warn: number;
    };
    literal: {
        debug: string;
        error: string;
        info: string;
        route: string;
        silly: string;
        verbose: string;
        warn: string;
    };
};

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
export function init(options: Object): void;

export function verbose(...args: any[]): void;

export function route(...args: any[]): void;

export function info(...args: any[]): void;

export function warn(...args: any[]): void;

export function debug(...args: any[]): void;

export function error(...args: any[]): void;



