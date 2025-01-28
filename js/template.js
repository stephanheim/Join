const pageTitles = {
    add_task: 'Add Task',
    summary: 'Summary User',
    board: 'Board',
    contacts: 'Contacts'
};


async function loadPageContentPath(page) {
    let contentPages = document.getElementById('content');
    const content = await fetchContent(`${page}.html`);
    contentPages.innerHTML = content;
    changePageTitles(page);
}


async function fetchContent(page) {
    try {
        const response = await fetch(`../pages/${page}`);
        return await response.text();
    } catch (error) {
        console.error('Fehler beim Abrufen');
    }
}


function changePageTitles(page){
    let changeTitles = pageTitles[page];
    return document.title = changeTitles;
}