class Task {
    constructor({ text, date, done, id }) {
        this.text = cleanInput(text);
        this.date = date;
        this.done = done;
        this.id = id;
    }
    toHTML() {       
        if (this.done == 'false') {
            return `
            <li class="task">
                <input type="checkbox" id="${ this.id }" class="form-check-input" onclick="updateTask('${ this.id }')">
                <label for="${ this.id }" class="task-description">${ this.text }</label>
                <label for="${ this.id }" class="task-date">${ this.prettyDate() }</label>
                <button class="material-icon task-delete"onclick="deleteTask('${ this.id }')">delete</button>
            </li>
            `
        }

        else {
            return `
            <li class="task">
                <input type="checkbox" id="${ this.id }" class="form-check-input" checked onclick="updateTask('${ this.id }')">
                <label for="${ this.id }" class="task-description checked">${ this.text }</label>
                <label for="${ this.id }" class="task-date">${ this.prettyDate() }</label>
                <button class="material-icon task-delete" onclick="deleteTask('${ this.id }')">delete</button>
            </li>
            `
        }
        
    }
    prettyDate() {
        var month = this.date.substring(5, 7);
        var day = this.date.substring(8, 10);
        var year = this.date.substring(0, 4);
        return `${ month }/${ day }/${ year }`
    }
    
    toggle() {       
        if (this.done == 'true') {
            this.done = 'false';
        }
        else {
            this.done = 'true';
        }
        return; 
    }
}

let tasks = [] // declare tasks array
tasks = this.readStorage(); // read in the localstorage
this.readTasks(); // update the DOM

// Get any saved form details
document.getElementById('form-text').value = localStorage.getItem('savedFormText');
document.getElementById('form-date').value = localStorage.getItem('savedFormDate');

function updateStorage(newData) {
    let jsonString = JSON.stringify(newData); // stringify the passed data
    localStorage.setItem('database', jsonString); // add to the database
    //console.log("Updating storage with: " + jsonString); // Log the new database
    return;
}


function readStorage() {
    let jsonString = localStorage.getItem('database'); // get database
    let result = JSON.parse(jsonString) || []; // parse json
    result = result.map(taskData => new Task(taskData)) // for each item in the database, create a new Task type
    return result; // 
}


function createTask(event) {
    // console.log("creating task");
    let formData = new FormData(event.currentTarget); // Pull in form data from DOM
    let json = JSON.stringify(Object.fromEntries(formData)); 
    json = JSON.parse(json); // Format it to JSON

    var newTask = new Task({ // Create a new task
        text: json["description"], // Use json description
        date: json["date"], // Use json date
        done: 'false', // Default to unchecked
        id: "id-" + Date.now() // Give an id based off current time, so no two share id
    })

    tasks = this.readStorage(); // Get storage
    tasks.push(newTask);

    localStorage.removeItem('savedFormText'); // Clears the saved form text
    localStorage.removeItem('savedFormDate'); // Clears the saved form date
    //document.forms[0].reset(); // Clears out the form, comment out if you don't want it to clear

    this.updateStorage(tasks); // Save it to local storage
    this.readTasks(); // Update DOM

    event.preventDefault(); // Don't refresh page
}


function readTasks() {
    // Clear the DOM, get latest storage, and add it out the DOM
    let list = document.getElementById('tasklist');
    list.innerHTML = '';
    tasks = this.readStorage(); 

    for (let i = 0; i < tasks.length; i++) {
        list.innerHTML += tasks[i].toHTML(); 
    }
    // console.log("Reading data to DOM")
    return;
}


function updateTask(id) { 
    // Toggles checkmark and 'done' state on task
    // console.log("Update id: " + id);
    for(let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].toggle();
        }
    }
    this.updateStorage(tasks); // Update storage
    this.readTasks(); // Update DOM
    // console.log("Updating task: " + id)
}


function deleteTask(id) {
    // console.log("Delete id: " + id); 
    for(let i = 0; i < tasks.length; i++) { // Go through array 
        if (tasks[i].id == id) { // Find task by ID
            tasks.splice(i, 1); // Remove from array
        }
    }
    this.updateStorage(tasks); // Update storage
    this.readTasks(); // Update DOM
}



document.getElementById("sort").addEventListener("click", sortByDate);
var sortedDate = false; // Initialize sorted state to false

function compareDates(a, b) {
    // Helper function for the SortByDate function
    if (a.date > b.date) {
        return 1;
    }
    else if (a.date < b.date) {
        return -1;
    }
    return 0;
}

function sortByDate() {
    let sortedTasks = tasks;
    // console.log("Sort: ", sortedTasks.sort(compareDates)); // Sorts by date
    sortedTasks.sort(compareDates); // Sorts by date

    if (sortedDate == true) {
        readTasks(); // Update DOM
        sortedDate = false; // Toggles sorted state to false
    }
    else {
        let list = document.getElementById('tasklist');
        list.innerHTML = '';

        for (let i = 0; i < sortedTasks.length; i++) { // Go through array
            list.innerHTML += sortedTasks[i].toHTML(); // Add task to HTML / DOM
        }
        sortedDate = true; // Toggles sorted state to true
        // console.log("Reading sorted data to DOM")    
    }
    if (filteredComplete == true) { // re-filters if necessary after sorting 
        filteredComplete = false; // will re-filter, so we need to set it to false so when it gets in function it will filter it.
        filterByComplete();
    }
}



document.getElementById("filter").addEventListener("click", filterByComplete);
var filteredComplete = false; // Initialize filtered state to false

function checkDone(task) {
    if (task.done == 'false') {
        return task;
    }
}

function filterByComplete() {
    let filteredTasks = tasks.filter(checkDone);
    if (filteredComplete == true) {
        // console.log("Bringing back completed tasks.");
        readTasks(); // Update DOM
        filteredComplete = false; // sets the filtered status to false

        if (sortedDate == true) { // Re-sorts if necessary after un-filtering
            sortedDate = false; // will re-sort, so we need to set it to false so when it gets in function it will sort it.
            sortByDate();
        }
    }
    else {
        // console.log("Filtering out completed tasks.");
        let list = document.getElementById('tasklist');
        list.innerHTML = ''; 
        for (let i = 0; i < filteredTasks.length; i++) {
            list.innerHTML+= filteredTasks[i].toHTML();   
        }
        filteredComplete = true; // sets the filtered status to true
        // console.log("Reading filtered data to DOM")   
    }
}


function cleanInput(string) { // Sanitizes input to make prevent XSS Attack
    const map = { // create map of various characters to sanitize 
        '<': '&lt;', 
        '>': '&gt;',
    };
    const reg = /[<>]/ig; // use RegEx for the angled brackets 
    return string.replace(reg, (match)=>(map[match])); // replace the angle brackets with their mapped equivalent 

    // return string; // Comment rest of block and uncomment this to remove XSS defense.
}


// Saves Task name and date in case of page refresh
document.getElementById("form-text").addEventListener("input", saveFormText);
function saveFormText() {
    let saveText = document.getElementById('form-text').value;
    localStorage.setItem('savedFormText', saveText);
    //console.log('Saving Text: ' + localStorage.getItem('savedFormText'))
}

document.getElementById("form-date").addEventListener("input", saveFormDate); 
function saveFormDate() {
    let saveDate = document.getElementById('form-date').value;
    localStorage.setItem('savedFormDate', saveDate);
    //console.log('Saving Date: ' + localStorage.getItem('savedFormDate'))
}

function clearTasks() {
    let length = tasks.length;
    for (let i = 0; i < length; i++) {
        deleteTask(tasks[0].id);
    }
}


