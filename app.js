var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const swaggerUi = require('swagger-ui-express');

var apiRouter = require('./routes/');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

app.use('/', apiRouter);

module.exports = app;
