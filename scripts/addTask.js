let allTask = [];
let SelectedEmployees = [];
let SelectedEmployeeEmails = [];


/**
 * This function creates all employees to assign the task to you.
 * 
 */
function EmployeePicker() {
    document.getElementById('NameFromEmployess').innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        const user = decrypt('salt', users[i]['name']);
        document.getElementById('NameFromEmployess').innerHTML += /*html*/ `<li class="employee" id="MA ${i}" onclick="SelectEmployee('${i}', '${user}')"> ${user} </li>`;
    }
}


/**
 * This function passes the selected employee to task.
 * @param {number} i 
 * 
 */
function SelectEmployee(i, user) {
    let SelectedEmployee = user;
    let SelectedEmployeeEmail = decrypt('salt', users[i]['email']);
    selectEmployeeQuery(i, SelectedEmployee, SelectedEmployeeEmail);
    touchesButtonCreateTask();
    document.getElementById(`MA ${i}`).innerHTML;
    document.getElementById(`MA ${i}`).classList.toggle('Employee-selected');
}


function touchesButtonCreateTask() {
    document.getElementById('createdButton').disabled = false;
    document.getElementById('createdButton').classList.add('createButtonhover');
}


function selectEmployeeQuery(i, SelectedEmployee, SelectedEmployeeEmail) {
    if (document.getElementById(`MA ${i}`).classList.contains('Employee-selected')) {
        deleteSelectedEmployees(SelectedEmployee, SelectedEmployeeEmail);
    } else {
        pushSelectedEmployees(SelectedEmployee, SelectedEmployeeEmail);
    }
}


function deleteSelectedEmployees(SelectedEmployee, SelectedEmployeeEmail) {
    SelectedEmployees.splice(SelectedEmployee, 1);
    SelectedEmployeeEmails.splice(SelectedEmployeeEmail, 1);
    console.log('delete', SelectedEmployee, SelectedEmployeeEmail);
}


function pushSelectedEmployees(SelectedEmployee, SelectedEmployeeEmail) {
    SelectedEmployees.push(SelectedEmployee);
    SelectedEmployeeEmails.push(SelectedEmployeeEmail);
    console.log('push', SelectedEmployee, SelectedEmployeeEmail);
}


/**
 * this function creates a new task with the specified information
 * 
 */
function createdTask() {
    let title = document.getElementById('title').value;
    let date = document.getElementById('date').value;
    let categorie = document.getElementById('categorie').value;
    let prio = document.getElementById('prio').value;
    let description = document.getElementById('description').value;
    let creator = currentUser[0]['name'];
    let creatorEmail = currentUser[0]['email'];
    taskBuild(title, date, categorie, prio, description, creator, creatorEmail);
}


async function taskBuild(title, date, categorie, prio, description, creator, creatorEmail) {
    let task = {
        'title': title,
        'date': date,
        'categorie': categorie,
        'prio': prio,
        'description': description,
        'creator': creator,
        'creatorEmail': creatorEmail,
        'createdAt': new Date().getTime(),
        'state': 'todo',
        'SelectedEmployee': SelectedEmployees,
        'SelectedEmployeeEmail': SelectedEmployeeEmails,
    }
    await addTask(task);
}


/**
 * This function is for better readability. It only executes the functions.
 * @param {*} task - Task is the task you just created.
 * 
 */
async function addTask(task) {
    await taskPushToAllTask(task);
    blankForm();
    openBacklog();
}


/**
 * This function adds "task" to  "allTask".
 * @param {string} task  - Task is the task you just created.
 * 
 */
async function taskPushToAllTask(task) {
    allTask.push(task);
    await backend.setItem('task', JSON.stringify(allTask));
}


/**
 * This function redirects you to the board.html after creating a new task.
 * 
 */
function openBacklog() {
    window.location.href = "https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/backlog.html";
}


/**
 * This function empties the form after creating a new task.
 * 
 */
function blankForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}


/**
 * This function loads allTask into backend as soon as the app is opened.
 * 
 */
function loadAllTask() {
    allTask = JSON.parse(backend.getItem('task')) || [];
    allBoardTask = JSON.parse(backend.getItem('allBoardTask')) || [];
}