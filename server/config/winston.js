import * as winston from 'winston';

winston.emitErrs = true;

const logger = winston.createLogger({
  format: winston.format.printf(info => `${new Date().toISOString()} [${info.level.toUpperCase()}] ${info.message}`),
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: 'access.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});
 
// eslint-disable-next-line no-unused-vars
logger.stream.write = (message, encoding) => logger.info(message);

export default logger;
