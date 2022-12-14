setURL('https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/Join/smallest_backend_ever');


let users = [];
let currentUser = [];
let red = 'alert-text-design-red';
let green = 'alert-text-design-green';


/**
 * Load all Users for the login.
 * 
 */
async function loadDataBase() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('user')) || [];
    loadFromLocalStorage();
    loadCurrentUser();
    loadAllTask();
}


/**
 * Load all Users from the Server for the admin-panel.
 * 
 */
async function loadDataBaseForPanel() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('user')) || [];
    showAllUsers();
    loadFromLocalStorage();
    loadCurrentUser();
}


/**
 * Crypt the Password and Username
 * @param {string} salt 
 * @param {string} text 
 * @returns 
 * 
 */
const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};


/**
 * decrypt the Password and Username for the Login.
 * @param {string} salt 
 * @param {string} encoded 
 * @returns
 * 
 */
const decrypt = (salt, encoded) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
};


/**
 * Show all users in the admin-panel.
 * 
 */
function showAllUsers() {
    let allUsers = document.getElementById('allUsers');
    allUsers.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        const decryptUserName = decrypt('salt', users[i]['name']);
        const decryptEmail = decrypt('salt', users[i]['email']);
        const isAdmin = users[i]['isAdmin'];
        const isChangePassword = users[i]['changePassword'];
        allUsers.innerHTML += generateShowAllUsersHTML(decryptUserName, decryptEmail, i);
        adminTrue(isAdmin, i);
        passwordChanged(isChangePassword, i);
    }
}


/**
 * 
 * @param {boolean} isAdmin 
 * @param {number} i 
 * 
 */
function adminTrue(isAdmin, i) {
    if (isAdmin == true) {
        document.getElementById(`admin${i}`).innerHTML = "Yes";
    } else {
        document.getElementById(`admin${i}`).innerHTML = "No";
    }
}


/**
 * 
 * @param {boolean} isAdmin 
 * @param {number} i 
 * 
 */
function passwordChanged(isChangePassword, i) {
    if (isChangePassword == true) {
        document.getElementById(`isPasswordChanged${i}`).innerHTML = "Yes";
    } else {
        document.getElementById(`isPasswordChanged${i}`).innerHTML = "No";
    }
}


/**
 * Generate all users in the HTML-content.
 * @param {string} decryptUserName 
 * @param {number} i 
 * @returns 
 * 
 */
function generateShowAllUsersHTML(decryptUserName, decryptEmail, i) {
    return /*html*/ `
    <div class="flex-left underline mt-3">
        <div class=" width-225px">
            <span>
                <b>
                    Username:
                </b>
                <br>
            </span> 
            <div class="name-flex">
                <span>
                    ${decryptUserName}
                </span>
                <span>
                    ${decryptEmail}
                </span>
            </div>
        </div>
        <div class="mb-3 width-200px">
            <span class="">
                <b>
                    Admin:
                </b>
                <br>
            </span> 
            <span id="admin${i}">
            </span>
        </div>
        <div class="mb-3 width-200px">
            <span class="">
                <b>
                    Password-Change:
                </b>
                <br>
            </span> 
            <span id="isPasswordChanged${i}">
            </span>
        </div>
        <div class="delete-btn-container">
            <button onclick="changedPwInPanel(${i})" class="delete-btn-design me-2">
                Change
            </button>
        </div>   
        <div class="delete-btn-container">
            <button onclick="deleteUsers(${i})" class="delete-btn-design me-2">
                Delete
            </button>
        </div>    
 
    </div>`
}


/**
 * create a new user
 * 
 */
async function createUser() {
    let userName = document.getElementById('newUserName');
    let userEmail = document.getElementById("newUserEmail");
    let userPassword = document.getElementById('newUserPassword');
    let isAdmin = document.getElementById('isAdmin');
    const cryptUserName = crypt('salt', userName.value);
    const cryptEmail = crypt('salt', userEmail.value);
    const cryptPassword = crypt('salt', userPassword.value);
    adminChecked(isAdmin, cryptUserName, cryptEmail, cryptPassword);
    blankValue(userName, userEmail, userPassword);
}


function adminChecked(isAdmin, cryptUserName, cryptEmail, cryptPassword) {
    if (isAdmin.checked == false) {
        noAdmin(cryptUserName, cryptEmail, cryptPassword);
        showAlert(green, 'A new user has been created.');
    } else {
        admin(cryptUserName, cryptEmail, cryptPassword);
        showAlert(green, 'A new user was created as admin.');
    }
}


function blankValue(userName, userEmail, userPassword) {
    userName.value = "";
    userEmail.value = "";
    userPassword.value = "";
    showAllUsers();
}


/**
 * Add user in wihtout admin.
 * @param {string} cryptUserName 
 * @param {string} cryptEmail
 * @param {string} cryptPassword 
 * 
 */
async function noAdmin(cryptUserName, cryptEmail, cryptPassword) {
    let user = {
        'name': cryptUserName,
        'email': cryptEmail,
        'password': cryptPassword,
        'isAdmin': false,
        'changePassword': false
    }
    users.push(user);
    await backend.setItem('user', JSON.stringify(users));
}


/**
 * Add user in admin.
 * @param {string} cryptUserName 
 * @param {string} cryptEmail 
 * @param {string} cryptPassword 
 * 
 */
async function admin(cryptUserName, cryptEmail, cryptPassword) {
    let user = {
        'name': cryptUserName,
        'email': cryptEmail,
        'password': cryptPassword,
        'isAdmin': true,
        'changePassword': false
    }
    users.push(user);
    await backend.setItem('user', JSON.stringify(users));
}


/**
 * Delete User
 * @param {number} i
 * 
 */
async function deleteUsers(i) {
    showAlert(green,'The user has been deleted from the database.');
    users.splice(i, 1);
    await backend.setItem('user', JSON.stringify(users));
    showAllUsers();
}


/**
 * set the changedPassword in the admin-panel = true
 * @param {number} i 
 */
async function changedPwInPanel(i) {
    if (users[i]['changePassword'] == true) {
        await showAlert(red, 'The password must be changed at the next login.');
    } else if (users[i]['changePassword'] == false) {
        await showAlert(green,'The user can change his password the next time he logs in.');
        users[i]['changePassword'] = true;
        await backend.setItem('user', JSON.stringify(users));
        showAllUsers();
    }
}


/**
 * show the alerts in green or red.
 * @param {string} color 
 * @param {string} text 
 */
async function showAlert(color, text) {
    document.getElementById("alertText").classList.add(`${color}`);
    document.getElementById("alertText").innerHTML = `${text}`;
    document.getElementById("alertText").classList.remove('d-none');
    document.getElementById("alertText").classList.add('transform-back');
    setTimeout(() => {
        document.getElementById("alertText").classList.remove('transform-back');
        setTimeout(() => {
            document.getElementById("alertText").classList.add('d-none');
        }, 250);
    }, 4000);
}


/**
 * login-Function
 * 
 */
function login() {
    let userName = document.getElementById('userName');
    let userPassword = document.getElementById('userPassword');
    for (let i = 0; i < users.length; i++) {
        const decryptUserName = decrypt('salt', users[i]['name']);
        const decryptPassword = decrypt('salt', users[i]['password']);
        const decryptEmail = decrypt('salt', users[i]['email']);
        const isAdmin = users[i]['isAdmin'];
        const changePassword = users[i]['changePassword'];
        isThePasswordCorrect(decryptUserName, decryptPassword, decryptEmail, isAdmin, changePassword);
    }
    userName.value = "";
    userPassword.value = "";
}


function isThePasswordCorrect(decryptUserName, decryptPassword, decryptEmail, isAdmin, changePassword) {
    if (userName.value == decryptUserName && userPassword.value == decryptPassword && changePassword == false) {
        isLogedIn(decryptUserName, decryptEmail, isAdmin);
    } else if (userName.value == decryptUserName && userPassword.value == decryptPassword && changePassword == true) {
        document.getElementById('loginScreen').classList.add('d-none');
        document.getElementById('changePasswordScreen').classList.remove('d-none');
    } else {
        showErrorMessage();
    }
}


/**
 * function when the correct user loged in.
 * 
 */
function isLogedIn(decryptUserName, decryptEmail, isAdmin) {
    window.location.href = "https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/board.html";
    let NewcurrentUser = {
        'name': decryptUserName,
        'email': decryptEmail,
        'isAdmin': isAdmin
    }
    currentUser.push(NewcurrentUser);
    saveToLocalStorage();
}


function isLogedInGast() {
    window.location.href = "https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/board.html";
    let gastUser = {
        'name': "Gast",
        'email': "gast@fake.de"
    }
    currentUser.push(gastUser);
    saveToLocalStorage();
}


/**
 * Error Message when user does not exist.
 * 
 */
function showErrorMessage() {
    setTimeout(() => {
        document.getElementById('noUser').classList.remove("d-none");
        document.getElementById('extras').classList.remove('mt-5');
        document.getElementById('extras').classList.add('mt-2');
    }, 250);
}


/**
 * changed password function, when changedPassword on true
 * 
 */
async function changePassword() {
    let userName = document.getElementById('checkUserName');
    let userPassword = document.getElementById('oldPassword');
    let newUserPassword = document.getElementById('newUserPassword');
    const cryptPassword = crypt('salt', newUserPassword.value);
    for (let i = 0; i < users.length; i++) {
        const decryptUserName = decrypt('salt', users[i]['name']);
        const decryptPassword = decrypt('salt', users[i]['password']);
        queryNewPassword(userName, userPassword, cryptPassword, decryptUserName, decryptPassword, i);
    }
    saveNewPassword();
}


function queryNewPassword(userName, userPassword, cryptPassword, decryptUserName, decryptPassword, i) {
    if (userName.value == decryptUserName && userPassword.value == decryptPassword) {
        users[i]['password'] = cryptPassword;
        users[i]['changePassword'] = false;
    } else {
        users[i]['changePassword'] = true;
    }
}


async function saveNewPassword() {
    await backend.setItem('user', JSON.stringify(users));
    document.getElementById('loginScreen').classList.remove('d-none');
    document.getElementById('changePasswordScreen').classList.add('d-none');
    document.getElementById('noUser').classList.add("d-none");
}


/**
 * load loginIn User
 * 
 */
function loadCurrentUser() {
    for (let i = 0; i < currentUser.length; i++) {
        const currentUserName = currentUser[i]['name'];
        const currentUserAdmin = currentUser[i]['isAdmin'];
        whatCurrentUser(currentUser, currentUserName, currentUserAdmin);
    }
}


function whatCurrentUser(currentUser, currentUserName, currentUserAdmin) {
    if (currentUser.length > 0) {
        document.getElementById("currentUser").innerHTML = `${currentUserName}`;
        document.getElementById("currentUserResponsive").innerHTML = `${currentUserName}`;
    }
    if (currentUserName && currentUserAdmin == true) {
        document.getElementById("adminPanel").classList.remove("d-none");
        document.getElementById("adminPanelResponsive").classList.remove("d-none");
    } else {
        document.getElementById("adminPanel").classList.add("d-none");
        document.getElementById("adminPanelResponsive").classList.add("d-none");
    }
}


/**
 * userLogout and delete the Name from the Localstorage.
 * 
 */
function userLogout() {
    currentUser.splice(0);
    saveToLocalStorage();
}


/**
 * Localstorage for the current user login
 */
function saveToLocalStorage() {
    let currentUserAsText = JSON.stringify(currentUser);
    localStorage.setItem('currentUser', currentUserAsText);
}
function loadFromLocalStorage() {
    let currentUserAsText = localStorage.getItem('currentUser');
    if (currentUserAsText) {
        currentUser = JSON.parse(currentUserAsText);
    }
}


/**
 * show / hide password
 * 
 */
function password_show_hide() {
    let x = document.getElementById("userPassword");
    let show_eye = document.getElementById("show_eye");
    let hide_eye = document.getElementById("hide_eye");
    queryShowHide(x, show_eye, hide_eye);
}


function queryShowHide(x, show_eye) {
    hide_eye.classList.remove("d-none");
    if (x.type === "password") {
        x.type = "text";
        show_eye.classList.remove('d-none');
        hide_eye.classList.add('d-none');
    } else {
        x.type = "password";
        show_eye.classList.add('d-none');
        hide_eye.classList.remove('d-none');
    }
}