async function init() {
    await includeHTML();
    legacyTurn();
    setTimeout(() => {
        noLogin();
    }, 500);
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * disable the Menu on the privacy and imprint side.
 * 
 */
function legacyTurn() {
    if (window.location.href == 'privacy.html' || window.location.href == 'imprint.html') {
        document.getElementById("responsive").classList.add('d-none');
        document.getElementById("links").classList.add('d-none');
        document.getElementById("legacy-btn").classList.add('d-none');
    } else {
        document.getElementById("responsive").classList.remove('d-none');
        document.getElementById("links").classList.remove('d-none');
        document.getElementById("legacy-btn").classList.remove('d-none');
    }
}


/**
 * Immediately prevents login
 * 
 */
function noLogin() {
    if (currentUser.length == 0) {
        document.location.href = 'https://thomas-ketler.developerakademie.net/Gruppenarbeit-Join/index.html';
    }
}