/**
 * Ein Objekt, das den Titel für jede Seite enthält.
 * @type {Object.<string, string>}
 */
const pageTitles = {
    add_task: 'Add Task',
    summary: 'Summary User',
    board: 'Board',
    contacts: 'Contacts'
};


/**
 * Lädt den Inhalt einer Seite und setzt den Titel des Dokuments entsprechend der Seite.
 * 
 * @param {string} page - Der Name der Seite, die geladen werden soll.
 * @returns {Promise<void>} Ein Promise, das den Abschluss des Ladevorgangs anzeigt.
 */
async function loadPageContentPath(page) {
    let contentPages = document.getElementById('content');
    const content = await fetchContent(`${page}.html`);
    contentPages.innerHTML = content; 
    changePageTitles(page);  
}


/**
 * Ruft den Inhalt einer Seite ab.
 * 
 * @param {string} page - Der Name der Seite, deren Inhalt geladen werden soll.
 * @returns {Promise<string>} Der Inhalt der Seite als Text.
 */
async function fetchContent(page) {
    try {
        const response = await fetch(`../pages/${page}`);
        return await response.text(); 
    } catch (error) {
        console.error('Fehler beim Abrufen'); 
    }
}


/**
 * Ändert den Titel des Dokuments entsprechend dem übergebenen Seitenparameter.
 * 
 * @param {string} page - Der Name der Seite, dessen Titel gesetzt werden soll.
 */
function changePageTitles(page) {
    let changeTitles = pageTitles[page]; 
    document.title = changeTitles; 
}
