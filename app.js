const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const userRoute = require('./routes/user');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const AppError = require('./utils/AppError');
const res = require('express/lib/response');

//Config
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

// app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('HELLO STUREE');
});
app.use('/api/users', userRoute);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server`,
    404,
  );
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
