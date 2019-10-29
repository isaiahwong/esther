const path = require('path');
const { BadRequest } = require('horeb');
const logger = require('../build/esther');

logger.init({
  disableStackTrace: true,
  useFileTransport: true,
  logDirectory: path.join(__dirname, 'logs'),
});
const err = new BadRequest('wooo');
logger.error(err, { isHandledError: true });
