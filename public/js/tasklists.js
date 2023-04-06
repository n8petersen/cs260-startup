const newListEvent = 'newList';
const newTaskEvent = 'newTask';

async function getLists() {
    let username = localStorage.getItem('username');
    let lists = [];

    try {
        let response = await fetch('/api/tasklists', {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
            },
        });

        lists = await response.json();
        printTaskLists(lists);
    } catch {
        alert("An error occured. Please reload and try again.");
    }
}

async function createList() {
    let newListName = document.querySelector('#newListName')?.value;
    let username = localStorage.getItem('username');
    let newList = { username: username, listname: newListName };
    let lists = [];

    try {
        let response = await fetch('/api/tasklist', {
            method: 'post',
            body: JSON.stringify(newList),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
            },
        });

        let body = await response.json();

        if (response?.status === 200) {
            lists = body;
            printTaskLists(lists);
            broadcastEvent(username, newListEvent);
        } else {
            alert(body.msg);
        }
    } catch {
        alert("An error occured. Please reload and try again.");
    }
}

async function deleteList(listId) {
    let username = localStorage.getItem('username');
    let deleteList = { id: listId };
    let lists = [];

    try {
        let response = await fetch('/api/tasklist', {
            method: 'delete',
            body: JSON.stringify(deleteList),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Username': username,
            },
        });

        let body = await response.json();

        if (response?.status === 200) {
            lists = body;
            printTaskLists(lists);
        } else {
            alert(body.msg);
        }
    } catch {
        alert("An error occured. Please reload and try again.");
    }
}

function printTaskLists(lists) {
    let listOfLists = document.getElementById('lists');
    listOfLists.innerHTML = '';

    for (let i = 0; i < lists.length; i++) {
        listOfLists.innerHTML += listToHTML(lists[i]);
    }
    return;
}

function listToHTML(list) {
    return `
        <li class="list-group-item">
            <a href="./list.html?listID=${list._id}&listName=${list.listname}">${list.listname}</a>
            <button type="button" class="material-icon trash-can float-end" onclick="deleteList('${list._id}')">delete</button>
        </li>
    `
}


// Print current lists on page load
let currentLists = getLists();
printTaskLists(currentLists);

// Print current user on the navbar
document.getElementById('currentUser').innerHTML = localStorage.getItem('username');



// hit login button on "Enter" keypress
var input = document.getElementById('newListName');
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        // alert("test");
        document.getElementById("newListButton").click();
    }
});




configureWebSocket();


// Functionality for peer communication using WebSocket
function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';

    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    socket.onopen = (event) => {
        displayMsg('Database', 'connected');
    };
    socket.onclose = (event) => {
        displayMsg('Database', 'disconnected');
    };

    socket.onmessage = async (event) => {
        const msg = JSON.parse(await event.data.text());
        if (msg.type === newTaskEvent) {
            displayMsg(msg.from, `created a new task.`);
        }
        else if (msg.type === newListEvent) {
            displayMsg(msg.from, `created a new list.`);
        }
    };
}

function displayMsg(from, msg) {
    const chatText = document.querySelector('#user-messages');
    chatText.innerHTML +=
        `<div class="event"><span>${from}</span> ${msg}</div>`;
}

function broadcastEvent(from, type) {
    const event = {
        from: from,
        type: type
    };
    socket.send(JSON.stringify(event));
}