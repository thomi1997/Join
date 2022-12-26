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


/**
 * all function together.
 * @param {number} i 
 */
async function boardPushFunction(i) {
    allTaskPushToAllBoardTask(i);
    saveUserOnTheBord();
    saveTicketsOnBacklog();
    loadTaskToBacklog();
    openBoard();
}


function openBoard() {
    window.location.href = 'https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/board.html';
}


/**
 * pushed the specific task to the board.
 * @param {number} i 
 */
function allTaskPushToAllBoardTask(i) {
    allBoardTask.push(allTask[i]);
    deleteTaskOnBacklog(i);
}


/**
 * delete the task on the backlog.
 * @param {number} i 
 */
async function deleteTaskOnBacklog(i) {
    allTask.splice(i, 1);
    await backend.setItem('task', JSON.stringify(allTask));
    loadTaskToBacklog();
}


/**
 * saved allTask on the backlog.
 * 
 */
async function saveTicketsOnBacklog() {
    await backend.setItem('task', JSON.stringify(allTask));
}


/**
 * saved allBoardTask on the board.
 * 
 */
async function saveUserOnTheBord() {
    await backend.setItem('allBoardTask', JSON.stringify(allBoardTask));
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
        let mitglieder = task['SelectedEmployee'];
        let email = task['SelectedEmployeeEmail'];
        backlog.innerHTML += renderBacklogTask(task, i);
        for (let j = 0; j < mitglieder.length; j++) {
                document.getElementById(`mitglieder ${task['createdAt']}`).innerHTML += /*html*/ `<div class=""> ${mitglieder[j]} </div>`;
        }
        for (let k = 0; k < email.length; k++) {
            document.getElementById(`email ${task['createdAt']}`).innerHTML += /*html*/ `<div class=""> ${email[k]} </div>`;
        }
        setCategoryColor(task, i);
    }
}


function openNamesBar(ticketnumber) {
    document.getElementById(`mitglieder ${ticketnumber}`).classList.remove('d-none');
    document.getElementById(`bar-names-open ${ticketnumber}`).classList.add('d-none');
    document.getElementById(`bar-names-close ${ticketnumber}`).classList.remove('d-none');
}


function closeNamesBar(ticketnumber) {
    document.getElementById(`mitglieder ${ticketnumber}`).classList.add('d-none');
    document.getElementById(`bar-names-close ${ticketnumber}`).classList.add('d-none');
    document.getElementById(`bar-names-open ${ticketnumber}`).classList.remove('d-none');
}


function openEmailsBar(ticketnumber) {
    document.getElementById(`email ${ticketnumber}`).classList.remove('d-none');
    document.getElementById(`bar-emails-open ${ticketnumber}`).classList.add('d-none');
    document.getElementById(`bar-emails-close ${ticketnumber}`).classList.remove('d-none');
}


function closeEmailsBar(ticketnumber) {
    document.getElementById(`email ${ticketnumber}`).classList.add('d-none');
    document.getElementById(`bar-emails-close ${ticketnumber}`).classList.add('d-none');
    document.getElementById(`bar-emails-open ${ticketnumber}`).classList.remove('d-none');
}


/**
 * sets the color from the task at the left side of the box.
 * @param {data from one added task} task 
 * @param {index from a single task} i 
 *
 */
function setCategoryColor(task, i) {
    background = document.getElementById(`bl-category${i}`);
    if (task.categorie == 'Product')
        background.classList.add('Product');
    if (task.categorie == 'Marketing')
        background.classList.add('Marketing');
    if (task.categorie == 'Sale')
        background.classList.add('Sale');
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
        <div class="content-bg border-0 mb-3 px-2 py-3 rounded-end rounded-0">
            <div class="backlog-content-container">
                <div class="headline-assigned-to-category"> 
                    <div class="assigned-to">
                        <div class="d-flex">
                            <b>
                                Names:
                            </b>
                            <div>
                                <svg id="bar-names-open ${task['createdAt']}" class="bar-open-button" onclick="openNamesBar(${task['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                    <path 
                                        d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                                </svg>
                                <svg id="bar-names-close ${task['createdAt']}" class="bar-close-button d-none" onclick="closeNamesBar(${task['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                    <path 
                                        d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="d-none" id="mitglieder ${task['createdAt']}">
                        </div>
                        <div class="d-flex">
                            <b>
                                Email Addresses:
                            </b>
                            <div>
                                <svg id="bar-emails-open ${task['createdAt']}" class="bar-open-button" onclick="openEmailsBar(${task['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                    <path 
                                        d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                                </svg>
                                <svg id="bar-emails-close ${task['createdAt']}" class="bar-close-button d-none" onclick="closeEmailsBar(${task['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                    <path 
                                        d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
                                </svg>
                            </div>
                        </div>
                        <a id="email ${task['createdAt']}" class="overflow-hidden text-nowrap d-none">
                        </a>
                    </div>
                    <div class="category-backlog bg-blue">
                        <span>
                            ${task['categorie']}
                        </span>
                    </div>
                </div>
                <div class="details-action">
                    <div class="word-wrap description-container">
                        <span>
                            ${task['description']}
                        </span>
                    </div>
                    <div class="buttonPosition px-2">
                        <div>
                            <svg onclick="boardPushFunction(${i})" class="upload-img mr-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                    <path 
                                        d="M384 352v64c0 17.67-14.33 32-32 32H96c-17.67 0-32-14.33-32-32v-64c0-17.67-14.33-32-32-32s-32 14.33-32 32v64c0 53.02 42.98 96 96 96h256c53.02 0 96-42.98 96-96v-64c0-17.67-14.33-32-32-32S384 334.3 384 352zM201.4 9.375l-128 128c-12.51 12.51-12.49 32.76 0 45.25c12.5 12.5 32.75 12.5 45.25 0L192 109.3V320c0 17.69 14.31 32 32 32s32-14.31 32-32V109.3l73.38 73.38c12.5 12.5 32.75 12.5 45.25 0s12.5-32.75 0-45.25l-128-128C234.1-3.125 213.9-3.125 201.4 9.375z"/>
                            </svg>
                        </div>
                        <div>
                            <svg onclick="deleteTaskOnBacklog(${i})" class="trash-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                <path 
                                    d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}