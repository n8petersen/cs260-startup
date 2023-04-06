async function getTasks() {
    let username = localStorage.getItem('username');
    let listid = listID;

    let tasks = [];

    try {
        let response = await fetch('/api/tasks', {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
                'ListID': listid
            },
        });

        tasks = await response.json();
        printTasks(tasks);
    } catch {
        alert("An error occured. Please reload and try again.");
    }
}

async function addTask() {
    let username = localStorage.getItem('username');
    let listid = listID;
    let description = document.querySelector('#form-text')?.value;
    let date = document.querySelector('#form-date')?.value;
    let newTask = {
        username: username, listid: listid,
        description: description, date: date, done: false
    }

    let tasks = [];

    try {
        let response = await fetch('/api/task', {
            method: 'post',
            body: JSON.stringify(newTask),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
            },
        });

        let body = await response.json();

        if (response?.status === 200) {
            tasks = body;
            printTasks(tasks);
        } else {
            alert(body.msg);
        }

    } catch {
        alert("An error occured. Please reload and try again.");
    }
}

function printTasks(tasks) {
    let taskList = document.getElementById('tasklist');
    taskList.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        taskList.innerHTML += taskToHTML(tasks[i]);
    }
    return;
}

function taskToHTML(task) {
    if (task.done == false) {
        return `
        <li class="task list-group-item">
            <input type="checkbox" id="${task._id}" class="form-check-input" onclick="updateTask('${task._id}')">
            <label for="${task._id}" class="task-description">${task.description}</label>
            <label for="${task._id}" class="task-date">${prettyDate(task.date)}</label>
            <button class="material-icon trash-can float-end" onclick="deleteTask('${task._id}')">delete</button>
        </li>
        `
    }

    else {
        return `
        <li class="task list-group-item">
            <input type="checkbox" id="${task._id}" class="form-check-input" checked onclick="updateTask('${task._id}')">
            <label for="${task._id}" class="task-description checked">${task.description}</label>
            <label for="${task._id}" class="task-date">${prettyDate(task.date)}</label>
            <button class="material-icon trash-can float-end" onclick="deleteTask('${task._id}')">delete</button>
        </li>
        `
    }
};

function prettyDate(date) {
    var month = date.substring(5, 7);
    var day = date.substring(8, 10);
    var year = date.substring(0, 4);
    return `${month}/${day}/${year}`;
};




// get the current task list id on page load
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const listID = urlParams.get('listID');
const listName = urlParams.get('listName')

// set the page's list name
document.getElementById('currentListName').innerHTML = listName;

// Print current user on the navbar
document.getElementById('currentUser').innerHTML = localStorage.getItem('username');


// print tasks from list on page load
let currentTasks = getTasks();
printTasks(currentTasks);


// date picker default to day on page load
document.getElementById('form-date').valueAsDate = new Date();


// hit "add Task" button on enter keypress
var input = document.getElementById('form-text');
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        // alert("test");
        document.getElementById("addTaskButton").click();
    }
});