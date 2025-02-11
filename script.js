const pageTitles = {
  add_task: 'Add Task',
  summary: 'Summary User',
  board: 'Board',
  contacts: 'Contacts',
  privacy_policy: 'Privacy Policy',
  legal_notice: 'Legal notice',
  help: 'Help',
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

function changePageTitles(page) {
  let changeTitles = pageTitles[page];
  document.title = changeTitles;
}

function openAddFloatingTask() {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut');
  addTask.classList.add('slideIn');
  addTask.classList.remove('d-none');
  setTimeout(() => {
    addTask.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}



function addNewContact() {
  let addContactOverlay = document.getElementById('addContactOverlay');
  addContactOverlay.classList.remove = ('d-none');
  addContactOverlay.classList.add = ('overlay');

  addContactOverlay.innerHTML = generateFloaterHTML();
  
  document.getElementById('addCloseBtn').onclick = closeNewContact;
}

function closeNewContact(event) {
  let addContactOverlay = document.getElementById('addContactOverlay');

  addContactOverlay.classList.remove = ('overlay');
  addContactOverlay.classList.add = ('d-none');

  addContactOverlay.innerHTML = '';

}
