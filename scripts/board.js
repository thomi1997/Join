setURL('https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/Join/smallest_backend_ever');


let currentDraggedElement;


/**
* Loads all tasks that have been created.
* @function loadBoard()
* @function downloadFromServer()
* @function loadAllTask()
* @function loadAllFilter()
* 
*/
async function loadBoard() {
    await downloadFromServer();
    loadAllTask();
    loadAllFilter();
}


/**
* Here all the Tasks that have been created are filtered according to the state.
* After that all containers with the id="todo, inProgress, testing, done" will be emptied.
* Finally, the parameters are passed on to the respective functions.
* 
* @function filterTodoTask() 
* @param {string} curentToDo
* 
* @function filterInProgress() 
* @param {string} currenInProgress
* 
* @function filterTesting() 
* @param {string} currentTesting
* 
* @function filterDone() 
* @param {string} currentDone
* 
*/
function loadAllFilter() {
    let currentToDo = allBoardTask.filter(t => t['state'] == 'todo');
    let currenInProgress = allBoardTask.filter(t => t['state'] == 'inProgress');
    let currentTesting = allBoardTask.filter(t => t['state'] == 'testing');
    let currentDone = allBoardTask.filter(t => t['state'] == 'done');
    createdAllTickets(currentToDo, currenInProgress, currentTesting, currentDone);
}


function createdAllTickets(currentToDo, currenInProgress, currentTesting, currentDone) {
    areasBlank();
    filterTodoTask(currentToDo);
    filterInProgress(currenInProgress);
    filterTesting(currentTesting);
    filterDone(currentDone);
}


function areasBlank() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('testing').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}


/**
* In this four filter functions all parameters are read out and assigned to the correct Id.
* @function htmlTicket() 
* @param {string} index
* @param {number} i 
* 
* The function trashClose() makes the Icons with the respective Id's invisible.
* Id's = 'todo' 'inProgress' 'testing' // With the id 'done' the icons are displayed.
* @function trashClose() 
* @param {string} index
* @param {number} i
* 
*/
function filterTodoTask(currentToDo) {
    for (let i = 0; i < currentToDo.length; i++) {
        let index = currentToDo[i];
        let teamMembers = index['SelectedEmployee'];
        document.getElementById('todo').innerHTML += htmlTicket(i, index);
        loadAllTeammembers(index, teamMembers);
        move(i, index);
        inProgressClose(i, index);
        trashClose(i, index);
    }
}


function filterInProgress(currenInProgress) {
    for (let i = 0; i < currenInProgress.length; i++) {
        let index = currenInProgress[i];
        let teamMembers = index['SelectedEmployee'];
        document.getElementById('inProgress').innerHTML += htmlTicket(i, index);
        loadAllTeammembers(index, teamMembers);
        move(i, index);
        inProgressClose(i, index);
        trashClose(i, index);
    }
}


function filterTesting(currentTesting) {
    for (let i = 0; i < currentTesting.length; i++) {
        let index = currentTesting[i];
        let teamMembers = index['SelectedEmployee'];
        document.getElementById('testing').innerHTML += htmlTicket(i, index);
        loadAllTeammembers(index, teamMembers);
        move(i, index);
        testingClose(i, index);
        trashClose(i, index);
    }

}


function filterDone(currentDone) {
    for (let i = 0; i < currentDone.length; i++) {
        let index = currentDone[i];
        let teamMembers = index['SelectedEmployee'];
        document.getElementById('done').innerHTML += htmlTicket(i, index);
        loadAllTeammembers(index, teamMembers);
        move(i, index);
        testingClose(i, index);
        trashOpen(i, index);
    }
}


function loadAllTeammembers(index, teamMembers) {
    for (let j = 0; j < teamMembers.length; j++) {
        let container = document.getElementById(`teamMembersBoard ${index['createdAt']}`);
        container.innerHTML += /*html*/ `<div> ${teamMembers[j]}</div>`;
    }
}


/**
* The function deleteTaskOnBoard() finds out all parameters in allTask. At the position .createdAt is tested.
* If the test passes, the array is deleted at exactly the right place, at the first place.
* @function deleteTaskOnBoard()
* @param {number} i
* 
* With the line '' the array is deleted on the backend.
* After that everything is filtered again and rendered with the function loadAllFilter().
* @function loadAllFilter()
* 
* The pushAllTask() function will update everything that was changed again.
* @function pushAllTask()
* 
*/
async function deleteTaskOnBoard(i) {
    showAlert(green, 'This task has been successfully removed.');
    let deleteTask = allBoardTask.findIndex(obj => obj.createdAt == i);
    allBoardTask.splice(deleteTask, 1);
    await backend.deleteItem('boardtask');
    loadAllFilter();
    saveUserOnTheBord();
}


/**
 * Tickets that are in the same area as their button will be hidden. 
 * @param {number} i 
 * @param {string} index 
 */
function toDoButtonClose(i, index) {
    document.getElementById(`addToDo ${i} ${index['state']}`).classList.add('d-none');
}


function inProgressClose(i, index) {
    document.getElementById(`addInProgress ${i} ${index['state']}`).classList.add('d-none');
}


function testingClose(i, index) {
    document.getElementById(`addTesting ${i} ${index['state']}`).classList.add('d-none');
}


function doneClose(i, index) {
    document.getElementById(`addDone ${i} ${index['state']}`).classList.add('d-none');
}


/**
* The two functions trashOpen and trashClose read the correct parameters out of the array allTask.
* The parameters are then passed to the Id trashAktiv. 
* @function trashOpen()
* @function trashClose()
* @param {string} index
* @param {number} i
* 
* Finally, the icons are added or removed from exactly the right tickets.
* @classList .remove(`d-none`)
* @classList .add(`d-none`)
* 
*/
function trashOpen(i, index) {
    document.getElementById(`trashAktiv ${i} ${index['state']}`).classList.remove('d-none');
}


function trashClose(i, index) {
    document.getElementById(`trashAktiv ${i} ${index['state']}`).classList.add('d-none');
}


/**
* In AllTask all parameters in the .createdAt area are compared with currentDraggedElement.  
* If the test passes, the Id's are passed from the 'board.html' file with the moveto() function.
* @function ondrop="moveto()"
* @param {number} i = z.b The Id 'inProgress
*
*/
function moveto(i) {
    let array = allBoardTask.find(t => t.createdAt === currentDraggedElement);
    array['state'] = i;
    loadAllFilter();
    saveUserOnTheBord();
}


/**
 * ticketNumber is noted in area.
 * textAreaHtml passes 2 parameters and generates 4 buttons.
 * @param {number} i 
 * @param {string} index
 */
function move(i, index) {
    let ticketNumber = index['createdAt'];
    let container = document.getElementById(`area ${ticketNumber}`);
    container.innerHTML = textAreaHtml(i, index);
}


function textAreaHtml(i, index) {
    return /*html*/ `
        <button id="addToDo ${i} ${index['state']}" onclick="pushToToDo(${index['createdAt']})" class="push-section-button">
            To Do
        </button>
        <button id="addInProgress ${i} ${index['state']}" onclick="pushToInProgress(${index['createdAt']})" class="push-section-button">
            In Progress
        </button>
        <button id="addTesting ${i} ${index['state']}" onclick="pushToTesting(${index['createdAt']})" class="push-section-button">
            Testing
        </button>
        <button id="addDone ${i} ${index['state']}" onclick="pushToDone(${index['createdAt']})" class="push-section-button">
            Done
        </button>
    `;
}


/**
 * If the correct ticket is found, 'state' is replaced with the respective string.
 * @param {string} index 
 */
function pushToToDo(index) {
    let findTicket = allBoardTask.find(t => t.createdAt === index);
    findTicket['state'] = 'todo';
    loadAllFilter();
    saveUserOnTheBord();
}


function pushToInProgress(index) {
    let findTicket = allBoardTask.find(t => t.createdAt === index);
    findTicket['state'] = 'inProgress';
    loadAllFilter();
    saveUserOnTheBord();
}


function pushToTesting(index) {
    let findTicket = allBoardTask.find(t => t.createdAt === index);
    findTicket['state'] = 'testing';
    loadAllFilter();
    saveUserOnTheBord();
}


function pushToDone(index) {
    let findTicket = allBoardTask.find(t => t.createdAt === index);
    findTicket['state'] = 'done';
    loadAllFilter();
    saveUserOnTheBord();
}

/**
 * Opens the move bar and changes the images.
 * @param {string} index 
 */
function openMiniArea(index) {
    document.getElementById(`area ${index}`).classList.remove('d-none');
    document.getElementById(`closeIcon ${index}`).classList.remove('d-none');
    document.getElementById(`openIcon ${index}`).classList.add('d-none');
}


function closeMiniArea(index) {
    document.getElementById(`area ${index}`).classList.add('d-none');
    document.getElementById(`openIcon ${index}`).classList.remove('d-none');
    document.getElementById(`closeIcon ${index}`).classList.add('d-none');
}


function openNamesBarOnBoard(ticketNumber) {
    document.getElementById(`bar-names-ticket-open ${ticketNumber}`).classList.add('d-none');
    document.getElementById(`teamMembersBoard ${ticketNumber}`).classList.remove('d-none');
    document.getElementById(`bar-names-ticket-close ${ticketNumber}`).classList.remove('d-none');
}


function closeNamesBarOnBoard(ticketNumber) {
    document.getElementById(`bar-names-ticket-open ${ticketNumber}`).classList.remove('d-none');
    document.getElementById(`teamMembersBoard ${ticketNumber}`).classList.add('d-none');
    document.getElementById(`bar-names-ticket-close ${ticketNumber}`).classList.add('d-none');
}


/**
* The function startdragging() fetches with the ondragstart="" method
* on the htmlTicket() template to get the correct parameter (Index['createdAt']). 
* @function startdragging()
* @param {number} id = .createdAt
*/
function startdragging(id) {
    currentDraggedElement = id;
}


/**
* allowDrop() gives the possibility to move the elements.
* @function allowDrop()
* @function preventDefault()
* @param {ev} 
*/
function allowDrop(ev) {
    ev.preventDefault();
}


/**
* Renders all tickets with all current parameters.
* @function htmlTicket()
* @function ondragstart="startdragging()"
* @function onclick="deleteTaskOnBoard()"
* @param {number} currentDraggedElement
* @param {number} i 
* @param {string} index 
* @returns 
*/
function htmlTicket(i, index) {
    return /*html*/`
        <div id="${i} ${index['state']}" draggable="true" ondragstart="startdragging(${index['createdAt']})" class="${index['categorie']} ticket-color cursorMove">
            <div class="ticket word-wrap">
                <div class="d-flex justify-content-between">
                    <div class="d-flex align-center">
                        <div>
                            <img class="mr-10 img-25" src="img/icons8-calendar-150.png" alt="">
                        </div>
                        <span>
                            ${index['date']}
                        </span>
                    </div>
                    <div>
                        <svg id="trashAktiv ${i} ${index['state']}" onclick="deleteTaskOnBoard(${index['createdAt']})" class="trash-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                            <path 
                                d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-10">
                    <b>
                        ${index['title']}
                    </b>
                </div>
                <span>
                    ${index['description']}
                </span>
                <div class="section-bottum">
                    <div class="d-flex">
                        <div class="category-board word-wrap bg-blue mr-10">
                            <span>
                                ${index['categorie']}
                            </span>
                        </div>
                        <div class="category-board word-wrap bg-blue">
                            <span>
                                ${index['prio']}
                            </span>
                        </div>
                    </div>
                    <div class="teamMembers-div">
                        <span>
                            <b>
                                Created by:
                            </b> 
                            ${index['creator']}
                        </span>
                        <span>
                            <div class="d-flex">
                                <b>
                                    Teammembers:
                                </b>
                                <div>
                                    <svg id="bar-names-ticket-open ${index['createdAt']}" class="bar-open-button" onclick="openNamesBarOnBoard(${index['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                        <path 
                                            d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                                    </svg>
                                    <svg id="bar-names-ticket-close ${index['createdAt']}" class="bar-close-button d-none" onclick="closeNamesBarOnBoard(${index['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                        <path 
                                            d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
                                    </svg>
                                </div>
                            </div> 
                            <div class="d-none" id="teamMembersBoard ${index['createdAt']}">
                            </div>
                        </span>
                    </div>
                </div>
                <div>
                    <svg id="openIcon ${index['createdAt']}" class="open-area-icon" onclick="openMiniArea(${index['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                        <path 
                            d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/>
                    </svg>
                    <svg id="closeIcon ${index['createdAt']}" class="close-area-icon d-none" onclick="closeMiniArea(${index['createdAt']})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                        <path 
                            d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/>
                    </svg>
                </div>
                <div id="area ${index['createdAt']}" class="add-areas d-none">
                </div>
            </div>
        </div>
    `;
}



