const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

// use .env variables
require('dotenv').config()

const authCookieName = 'token';

// can take argument for a port. If unspecified use the env variable port
const port = process.argv.length > 2 ? process.argv[2] : process.env.STARTUP_PORT;

// JSON body parsing using middle-ware
app.use(express.json());

// cookie parser for auth tokens
app.use(cookieParser());

// serve up the app static content
app.use(express.static('public'));

// roouter for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await DB.createUser(req.body.email, req.body.password);

        // Set the cookie
        setAuthCookie(res, user.token);

        res.send({
            id: user._id,
        });
    }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:email', async (req, res) => {
    const user = await DB.getUser(req.params.email);
    if (user) {
        const token = req?.cookies.token;
        res.send({ email: user.email, authenticated: token === user.token });
        return;
    }
    res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});





// Get Tasks
apiRouter.get('/tasks', async (req, res) => {
    let tasks = await DB.getTasks(req.headers.username, req.headers.listid);
    res.send(tasks);
});

// Add Task
apiRouter.post('/task', async (req, res) => {
    await DB.addTask(req.body);
    let tasks = await DB.getTasks(req.body.username, req.body.listid);
    res.send(tasks);
});

apiRouter.put('/task', async (req, res) => {
    await DB.updateTask(req.body);
    let tasks = await DB.getTasks(req.headers.username, req.headers.listid);
    res.send(tasks);
});




// Get Lists
apiRouter.get('/tasklists', async (req, res) => {
    let taskLists = await DB.getLists(req.headers.username);
    res.send(taskLists);
});

// Add List
apiRouter.post('/tasklist', async (req, res) => {
    let list = await DB.getListByName(req.body)
    if (list) {
        res.status(409).send({ msg: 'List under that name already exists.' });
    } else {
        await DB.addList(req.body);
        let taskLists = await DB.getLists(req.headers.username);
        res.send(taskLists);
    }
});

// Delete List
apiRouter.delete('/tasklist', async (req, res) => {
    await DB.deleteList(req.body);
    let taskLists = await DB.getLists(req.headers.username);
    res.send(taskLists);
});





// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});





// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});