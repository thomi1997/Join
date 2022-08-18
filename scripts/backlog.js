let allBoardTask = [];
/**
 * load data from backend.
 * 
 */
async function loadBacklog() {
    await downloadFromServer();
    loadAllTask();
    loadTaskToBacklog();
}


async function boardPushFunction(id) {
    await allTaskPushToAllBoardTask();
    await deleteTaskOnBacklog(id);
    await saveUserOnTheBord();
    openBoard();
}


function openBoard() {
    window.location.replace('board.html');
}


async function allTaskPushToAllBoardTask() {
    allBoardTask.push(allTask);
    await backend.setItem('allBoardTask', JSON.stringify(allBoardTask));
}


async function deleteTaskOnBacklog(id) {
    let deleteTask = allTask.findIndex(obj => obj.createdAt == id);
    allTask.splice(deleteTask, 1);
    await backend.deleteItem('task');
    saveTicketsOnBacklog();
}


async function saveTicketsOnBacklog() {
    await backend.setItem('task', JSON.stringify(allTask));
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
            <div class="row g-0">
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
                <div class="col-md-8 bl-w-50 rs-mt pl">
                    <span>
                        ${task['description']}
                    </span>
                        <button onclick="boardPushFunction(${task['createdAt']})">
                            Delete
                        </button>
                </div>
            </div>
        </div>
    </div>`
}