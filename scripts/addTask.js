let allTask = [];
let SelectedEmployee;
let SelectedEmployeeEmail;


/**
 * This function creates all employees to assign the task to you.
 * 
 */
function EmployeePicker() {
    document.getElementById('NameFromEmployess').innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        const user = decrypt('salt', users[i]['name']);
        document.getElementById('NameFromEmployess').innerHTML += /*html*/ `<li class="employee" id="MA${i}" onclick="SelectEmployee(${i})"> ${user} </li>`;
    }
}


/**
 * This function passes the selected employee to task.
 * @param {number} i 
 * 
 */
function SelectEmployee(i) {
    ResestSelectedAvatar();
    deleteSelectEmployee();
    SelectedEmployee = document.getElementById(`MA${i}`).innerHTML;
    SelectedEmployeeEmail = decrypt('salt', users[i]['email']);
    document.getElementById('createdButton').disabled = false;
    document.getElementById('createdButton').classList.add('createButtonhover');
    document.getElementById(`MA${i}`).classList.toggle('Employee-selected');
}

/**
 * this function resets the information of the selected employee if another one is selected.
 * 
 */
function deleteSelectEmployee() {
    SelectedEmployee = '';
    SelectedEmployeeEmail = '';
}


/**
 * this function resets the design of the selected employee if another one is selected.
 * 
 */
function ResestSelectedAvatar() {
    for (let index = 0; index < users.length; index++) {
        document.getElementById(`MA${index}`).classList.remove('Employee-selected');
    }
}


/**
 * this function creates a new task with the specified information
 * 
 */
async function createdTask() {
    let title = document.getElementById('title').value;
    let date = document.getElementById('date').value;
    let categorie = document.getElementById('categorie').value;
    let prio = document.getElementById('prio').value;
    let description = document.getElementById('description').value;
    let creator = currentUser[0]['name'];
    let creatorEmail = currentUser[0]['email'];

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
        'SelectedEmployee': SelectedEmployee,
        'SelectedEmployeeEmail': SelectedEmployeeEmail,
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
    openBoard();
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
function openBoard() {
    window.location.href = "backlog.html";
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
    allBoardTask = JSON.parse(backend.getItem('boardtask')) || [];
}