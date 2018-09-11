import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressWinston from 'express-winston';
import favicon from 'serve-favicon';
import fs from 'fs';
import helmet from 'helmet';
import httpStatus from 'http-status';
import path from 'path';
import morgan from 'morgan';
import config from './config';
import routes from '../routes';
import winstonInstance from './winston';

const app = express();

if (config.env === 'development') {
  app.use(morgan('dev', {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr
  }));

  app.use(morgan('dev', {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout
  }));

  app.use(morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, '..', '..', 'access.log'), {flags: 'a'})
  }));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('view engine', 'html');

//Serving the files on the dist folder
app.use(express.static(path.join(__dirname, '..', '..', '..', 'dist', 'client')));
app.use(favicon(path.join(__dirname, '..', '..', '..', 'dist', 'client', 'favicon.ico')));

app.use(cookieParser());
app.use(compress());
app.use(helmet());  // secure apps by setting various HTTP headers
app.use(cors());   // enable CORS - Cross Origin Resource Sharing

// mount all routes
app.use('/api', routes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'dist', 'client', 'index.html'));
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  });
});

export default app;
