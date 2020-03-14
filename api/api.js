
// requires
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const helmet     = require('helmet');

// database connection
mongoose.connect(
    `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_CONTAINER_NAME}/${process.env.MONGO_INITDB_DATABASE}?authMechanism=SCRAM-SHA-1&authSource=admin`,
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }
, (err) => {
    if (err) {
        console.log('could\'t connect to Mongo DB ', err);
    }
});
mongoose.set('debug', true);

const enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Access-Token');
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    }
    next();
};
app.use(enableCORS);
app.use(helmet());

// parsers
app.use(bodyParser.urlencoded({ extended: true, limit: '16mb' }));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(morgan('dev'));

// public routes
app.use('/api', require('./routes/public'));
app.use('/api/users', require('./routes/users'));

app.listen(process.env.API_PORT);

console.log('Express-Mongo-Redis API listening on ' + process.env.API_PORT);
