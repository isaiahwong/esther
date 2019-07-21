import { BadRequest } from 'horeb';
import path from 'path';
import logger from '../src/esther';

logger.init({
  disableStackTrace: true,
  useFileTransport: true,
  logDirectory: path.join(__dirname, 'logs'),
});
const err = new BadRequest('wooo');
logger.error(err, { isHandledError: true });
