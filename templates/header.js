

function openNavMenu() {
    document.getElementById("responsive").classList.add("nav-transform-on");
    document.getElementById("openNav").classList.add("d-none");
    document.getElementById("closeNav").classList.remove("d-none");

}


function closeNavMenu() {
    document.getElementById("responsive").classList.remove("nav-transform-on");
    document.getElementById("openNav").classList.remove("d-none");
    document.getElementById("closeNav").classList.add("d-none");
}

