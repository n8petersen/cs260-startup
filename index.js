const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
// const DB = require('./database.js');
require('dotenv').config()

const authCookieName = 'token';

// can take argument for a port. If unspecified use the env variable port
const port = process.argv.length > 2 ? process.argv[2] : process.env.PORT;

// JSON body parsing using middle-ware
app.use(express.json());

// cookie parser for auth tokens
app.use(cookieParser());

// serve up the app static content
app.use(express.static('public'));

// roouter for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);





// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });