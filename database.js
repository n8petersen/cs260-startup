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
function getTasks(searchUsername, listId) {
  const query = {
    username: searchUsername,
    listid: listId
  };
  let tasks = taskCollection.find(query);

  return tasks.toArray();
}

async function addTask(task) {
  // newTask is an object consisting of: user, list, description, date
  await taskCollection.insertOne(task);
  return;
}

async function deleteTask(task) {
  let o_id = new mongo.ObjectId(task.id);
  await taskCollection.deleteOne({'_id': o_id});
}

async function updateTask(task) {
  let o_id = new mongo.ObjectId(task.id);
  let newValue = { $set : {done: task.setDone}}
  await taskCollection.updateOne({'_id': o_id}, newValue);
}




// Lists
function getListByName(task) {
  let query = {
    username: task.username,
    listname: task.listname
  };
  let returnList = listCollection.findOne(query);
  return returnList;
}

function getLists(searchUsername) {
  let query = {
    username: searchUsername
  };
  let taskLists = listCollection.find(query);
  return taskLists.toArray();
}

async function addList(list) {
  await listCollection.insertOne(list);

}

async function deleteList(list) {
  var o_id = new mongo.ObjectId(list.id);
  await listCollection.deleteOne({'_id': o_id});
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  getListByName,
  getLists,
  addList,
  deleteList,
};