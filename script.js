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

function openAddTask() {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  addTask.classList.remove('d-none');
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut');
  addTask.classList.add('slideIn');
  addTask.style.opacity = 0.5;
  setTimeout(() => {
    addTask.style.opacity = 1;
  }, 200);
}

function closeAddTask() {
  let floatingTask = document.getElementById('floatingAddTask');
  floatingTask.classList.add('slideOut');

  setTimeout(() => {
    floatingTask.classList.add('d-none');

    floatingTask.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}
