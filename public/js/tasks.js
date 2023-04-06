async function getTasks() {
    let username = localStorage.getItem('username');
    let listid = listID;

    try {
        let response = await fetch('/api/tasks', {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
                'ListID': listid
            },
        });

        body = await response.json();

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

async function addTask() {
    let username = localStorage.getItem('username');
    let listid = listID;
    let description = document.querySelector('#form-text')?.value;
    let date = document.querySelector('#form-date')?.value;
    let newTask = {
        username: username, listid: listid,
        description: description, date: date, done: false
    }

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

async function updateTask(taskId, taskDoneState) {
    let username = localStorage.getItem('username');
    let newDoneState = !taskDoneState
    let listid = listID;
    let updateTask = { id: taskId, setDone: newDoneState };

    try {
        let response = await fetch('/api/task', {
            method: 'put',
            body: JSON.stringify(updateTask),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
                'ListID': listid
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

async function deleteTask(taskId) {
    let username = localStorage.getItem('username');
    let listid = listID;
    let deleteTask = { id: taskId };

    try {
        let response = await fetch('/api/task', {
            method: 'delete',
            body: JSON.stringify(deleteTask),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
                'ListID': listid
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

function sortByDate() {
    let sortedTasks = JSON.parse(JSON.stringify(tasks)); // make DEEP copy of the tasks so we can unsort as well
    sortedTasks.sort(compareDates);

    if (sortedDate === true) { // check if we are already sorted by date
        printTasks(tasks); // print the unsorted tasks
        sortedDate = false; // and now set the sortedDate flag to false
    } 
    else { // otherwise we are unsorted
        printTasks(sortedTasks); // print the sorted tasks
        sortedDate = true; // set the sortedDate flag to true
    }
    if (filteredComplete === true) { // check if we need to refilter
        filteredComplete = false; // set it to false so it will get set to true in function
        filterByComplete();
    }
}

function filterByComplete() {
    let filteredTasks = JSON.parse(JSON.stringify(tasks)); // make DEEP copy of the tasks so we can unfilter as well
    filteredTasks = tasks.filter(checkDone);
    if (filteredComplete === true) {
        printTasks(tasks);
        filteredComplete = false; // sets the filtered status to false
    }
    else {
        printTasks(filteredTasks);
        filteredComplete = true; // sets the filtered status to true
    }
    if (sortedDate == true) { // Re-sorts if necessary after un-filtering
        sortedDate = false; // will re-sort, so we need to set it to false so when it gets in function it will sort it.
        sortByDate();
    }
}

function compareDates(a, b) {
    // Helper function for the sortByDate function
    if (a.date > b.date) {
        return 1;
    }
    else if (a.date < b.date) {
        return -1;
    }
    return 0;
}

function checkDone(task) {
    if (task.done === false) {
        return task;
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
            <input type="checkbox" id="${task._id}" class="form-check-input" onclick="updateTask('${task._id}', ${task.done})">
            <label for="${task._id}" class="task-description">${task.description}</label>
            <label for="${task._id}" class="task-date">${prettyDate(task.date)}</label>
            <button class="material-icon trash-can float-end" onclick="deleteTask('${task._id}')">delete</button>
        </li>
        `
    }

    else {
        return `
        <li class="task list-group-item">
            <input type="checkbox" id="${task._id}" class="form-check-input" checked onclick="updateTask('${task._id}', ${task.done})">
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
let tasks = [];
tasks = getTasks();
printTasks(tasks);

// initialize sorted and filtered values
// maybe put these in local storage at some point so they can be persistent?
var sortedDate = false;
var filteredComplete = false;


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