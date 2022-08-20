setURL('https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/Join/smallest_backend_ever');


let allBoardTask = [];


/**
 * load data from backend.
 * 
 */
async function loadBacklog() {
    await downloadFromServer();
    await loadData();
    loadTaskToBacklog();
}


/**
 * all function together.
 * @param {number} i 
 */
async function boardPushFunction(i) {
    await allTaskPushToAllBoardTask(i);
    await deleteTaskOnBacklog(i);
    await saveData();
    openBoard();
}


function openBoard() {
    window.location.href = 'board.html';
}


/**
 * pushed the specific task to the board.
 * @param {number} i 
 */
async function allTaskPushToAllBoardTask(i) {
    allBoardTask.push(allTask[i]);
    await saveData();
    /*await backend.setItem('allBoardTask', JSON.stringify(allBoardTask));*/
    /*loadBoard();*/
}


/**
 * delete the task on the backlog.
 * @param {number} i 
 */
async function deleteTaskOnBacklog(i) {
    allTask.splice(i, 1);
    await backend.setItem('task', JSON.stringify(allTask));
    await saveData();
}


/**
 * saved allTask on the backlog.
 * 
 */
async function saveData() {
    await backend.setItem('task', JSON.stringify(allTask));
    await backend.setItem('boardtask', JSON.stringify(allBoardTask));
    await loadData();
}


async function loadData() {
    allTask = JSON.parse(backend.getItem('task')) || [];
    allBoardTask = JSON.parse(backend.getItem('boardtask')) || [];
}


/**
 * loads data from each single task and renders a single box for each.
 *  
 */
function loadTaskToBacklog() {
    let backlog = document.getElementById('bl-content');
    backlog.innerHTML = '';
    for (let i = 0; i < allTask.length; i++) {
        let task = allTask[i];
        backlog.innerHTML += renderBacklogTask(task, i);
        setCategoryColor(task, i);
    }
}


/**
 * sets the color from the task at the left side of the box.
 * @param {data from one added task} task 
 * @param {index from a single task} i 
 *
 */
function setCategoryColor(task, i) {
    background = document.getElementById(`bl-category${i}`);
    if (task.categorie == 'Product') {
        background.classList.add('Product');
    }
    if (task.categorie == 'Marketing') {
        background.classList.add('Marketing');
    }
    if (task.categorie == 'Sale') {
        background.classList.add('Sale');
    }
}


/**
 * renders all task with all current parameters
 * @param {data from one added task} task 
 * @param {index from a single task} i 
 * @returns html code
 * 
 */
function renderBacklogTask(task, i) {
    return /*html*/ `
    <div id="bl-category${i}" class="bl-task-box">
        <div class="content-bg card border-0 mb-3 px-2 py-3 rounded-end rounded-0">
            <div class="row g-0 backlog-container">
                <div class="col-md-4 bl-w-50 d-flex align-items-center">
                    <div class="d-flex align-items-center bl-w-75">
                        <div class="d-flex flex-column w-100">
                            <span>
                                ${task['SelectedEmployee']}
                            </span>
                            <b>
                                E-mail:
                            </b>
                            <a class="overflow-hidden text-nowrap text-overflow">
                                ${task['SelectedEmployeeEmail']}
                            </a>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center bl-w-25">
                        <span>${task['categorie']}</span>
                    </div>
                </div>
                <div class="col-md-8 bl-w-50 rs-mt ps-3">
                    <span>
                        ${task['description']}
                    </span>
                </div>
                <div class="buttonPosition px-2">
                        <button class="my-1 backlog-btn" onclick="boardPushFunction(${i})">Push to board</button>
                        <button class="my-1 backlog-btn" onclick="deleteTaskOnBacklog(${i})">Delete</button>
                </div>
            </div>
        </div>
    </div>`
}