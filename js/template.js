function init() {
    loadHeaderAndSidebar();
}

async function loadHeaderAndSidebar() {
    let header = document.getElementById('header');
    let sidebar = document.getElementById('sideBar');
    if (header && sidebar) {
        let responseHeader = await fetch('../templates/header.html');
        let responseSideBar = await fetch('../templates/side_menu.html');
        header.innerHTML = await responseHeader.text();
        sidebar.innerHTML = await responseSideBar.text();
    } else {
        console.error('not found');
    }
}
