const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

require('dotenv').config();

const DBuser = process.env.MONGOUSER;
const DBpass = process.env.MONGOPASSWORD;
const DBhostname = process.env.MONGOHOSTNAME;

if (!DBuser) {
  throw Error('Database not configured. Check env variables.');
}

const url = `mongodb+srv://${DBuser}:${DBpass}@${DBhostname}`;
console.log("Mongo URL:", url);

const client = new MongoClient(url);
const userCollection = client.db('checkerly').collection('users');
const listCollection = client.db('checkerly').collection('lists');
const taskCollection = client.db('checkerly').collection('tasks');
const friendsCollection = client.db('checkerly').collection('friends');

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

function addTask(user, list, description, date) {
  taskCollection.insertOne(user, list, description, date);
}

module.exports = {
  getUser,
  getUserByToken,
  createUser
};