const { MongoClient } = require('mongodb');
var mongo = require('mongodb');
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



// Tasks
function getTasks(searchUsername) {
  const query = {
    username: searchUsername
  };
  let tasks = taskCollection.find(query);
  return tasks.toArray();
}

function addTask(newTask) {
  // newTask is an object consisting of: user, list, description, date
  tasks = taskCollection.insertOne(newTask);
  return;
}



// Lists
function getListByName(list) {
  let query = {
    username: list.username,
    listname: list.listname
  };
  let returnList = listCollection.findOne(query);
  return returnList;
}

function getListById(listId) {
  let query = {
    _id: ObjectId('${listId}')
  }
  let returnList = listCollection.findOne
  return returnList;
}

function getLists(searchUsername) {
  let query = {
    username: searchUsername
  };
  let taskLists = listCollection.find(query);
  return taskLists.toArray();
}

async function addList(newList) {
  // newList is an object consisting of: user, listName;
  await listCollection.insertOne(newList);
  // return;
}

async function deleteList(list) {
  // newList is an object consisting of: user, listName;
  // await listCollection.deleteOne(list);
  // return;

  var o_id = new mongo.ObjectId(list.id);
  await listCollection.deleteOne({'_id': o_id});
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getTasks,
  addTask,
  getListByName,
  getListById,
  getLists,
  addList,
  deleteList,
};