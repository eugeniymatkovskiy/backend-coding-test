const winston = require('winston');
const fs = require('fs');

const errorFileLogs = './logs/error.log';
const allLogs = './logs/app.log';

if (!fs.existsSync(errorFileLogs)) {
  fs.appendFileSync(errorFileLogs, '');
}

if (!fs.existsSync(allLogs)) {
  fs.appendFileSync(allLogs, '');
}

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: errorFileLogs, level: 'error' }),
    new winston.transports.File({ filename: allLogs })
  ],
  handleExceptions: true,
  json: true,
  colorize: false,
  exitOnError: false
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

console.log = (...args) => logger.info.call(logger, ...args);
console.info = (...args) => logger.info.call(logger, ...args);
console.warn = (...args) => logger.warn.call(logger, ...args);
console.error = (...args) => logger.error.call(logger, ...args);
console.debug = (...args) => logger.debug.call(logger, ...args);

module.exports = logger;
