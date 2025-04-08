let currentPage = '';

const pageTitles = {
  addTask: 'Add Task',
  summary: 'Summary User',
  board: 'Board',
  contacts: 'Contacts',
  privacy_policy: 'Privacy Policy',
  legal_notice: 'Legal notice',
  help: 'Help',
};

async function initPages(page) {
  currentPage = page;
  toggleNavPrivacyByPage(page);
  if (page === 'summary') {
    initSummary();
  } else if (page === 'addTask') {
    initAddTask();
  } else if (page === 'board') {
    initBoard();
  } else if (page === 'contacts') {
    initContacts();
  }
}

async function loadPageContentPath(page) {
  let contentPages = document.getElementById('content');
  let content = await fetchContent(`${page}.html`);
  contentPages.innerHTML = content;
  initPages(page);
  toggleNavPrivacyByPage(page);
  changePageTitles(page);
  if (page === 'summary') {
    showUserWelcome();
  }
}

async function fetchContent(page) {
  try {
    const response = await fetch(`../pages/${page}`);
    return await response.text();
  } catch (error) {
    console.error('Fehler beim Abrufen');
  }
}

window.onresize = () => toggleNavPrivacyByPage(currentPage);

function toggleNavPrivacyByPage(page) {
  const nav = document.getElementById('navPrivacy');
  if (!nav) return;
  const isDashboardPage = ['summary', 'addTask', 'board', 'contacts', 'legal_notice', 'privacy_policy'].includes(page);
  const isSmallScreen = window.innerWidth < 1200;
  if (isDashboardPage && isSmallScreen) {
    nav.classList.add('d-none');
  } else {
    nav.classList.remove('d-none');
  }
}

function changePageTitles(page) {
  let changeTitles = pageTitles[page];
  document.title = changeTitles;
}

function setActiveNavBoard() {
  let boardNav = document.getElementById('sumToBoard');
  if (boardNav) {
    setActiveNav(boardNav);
  }
}

function setActiveNav(clickedNav) {
  let navLinks = document.getElementsByClassName('nav');
  let policyLinks = document.getElementsByClassName('policy-content');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove('active');
    navLinks[i].style.pointerEvents = 'auto';
  }
  for (let i = 0; i < policyLinks.length; i++) {
    policyLinks[i].classList.remove('active');
    policyLinks[i].style.pointerEvents = 'auto';
  }
  clickedNav.classList.add('active');
  clickedNav.style.pointerEvents = 'none';
}

function overlayClick(event) {
  let overlayContent = document.getElementById('contactFloater');
  if (!overlayContent.contains(event.target)) {
    animateCloseContact();
  }
}

function openHelpPage() {
  sessionStorage.setItem('previousPage', currentPage);
  loadPageContentPath('help');
}

function arrowBackToPreviousPage() {
  const previousPage = sessionStorage.getItem('previousPage');
  if (previousPage) {
    loadPageContentPath(previousPage);
    sessionStorage.removeItem('previousPage');
  }
}
