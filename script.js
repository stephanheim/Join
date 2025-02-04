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
  addTask.style.display = 'flex';
  addTask.className = 'floating-main';
  addTask.innerHTML = addTaskTemplate();
}

function closeAddTask() {
  let floatingTask = document.getElementById('floatingAddTask');
  if (floatingTask) {
    floatingTask.className = 'slide-out';
    setTimeout(() => {
      floatingTask.style.display = 'none';
      floatingTask.className = '';
    }, 200);
  }
}
