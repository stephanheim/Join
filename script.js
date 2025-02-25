let contactOpen = false;


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
  closeSubMenu();
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


function changePageTitles(page) {
  let changeTitles = pageTitles[page];
  document.title = changeTitles;
}


function showUserWelcome() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameUser = document.getElementById('welcomeUser');
  let welcomeUser = document.getElementById('welcomeMessage');
  nameUser.innerText = `${userData.name}`;
  welcomeUser.innerText = showDaytimeGreeting();
}


function showDaytimeGreeting() {
  let hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
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


function openAddFloatingTask() {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut');
  addTask.classList.add('slideIn');
  addTask.classList.remove('d-none');
  setTimeout(() => {
    addTask.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 300);
}


function closeAddFloatingTask() {
  let floatingTask = document.getElementById('floatingAddTask');
  floatingTask.classList.remove('slideIn');
  floatingTask.classList.add('slideOut');
  floatingTask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    floatingTask.classList.add('d-none');
    floatingTask.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}


function openSubMenu() {
  const submenu = document.getElementById('submenu');
  submenu.classList.remove('d-none');
}


function closeSubMenu() {
  let submenu = document.getElementById('submenu');
  if (submenu) {
    submenu.classList.add('d-none');
  }
}


function overlayClick(event) {
  let overlayContent = document.getElementById('contactFloater');
  if (!overlayContent.contains(event.target)) {
    closeNewContact();
  }
}


function addNewContact() {
  let addContact = document.getElementById('addContactOverlay');
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = 'hidden';
  addContact.classList.remove('slideOut');
  addContact.classList.add('slideIn');
  addContact.classList.remove('d-none');
  setTimeout(() => {
    addContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}


function closeNewContact() {
  let closeFloater = document.getElementById('addContactOverlay');
  closeFloater.classList.remove('slideIn');
  closeFloater.classList.add('slideOut');
  closeFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeFloater.classList.add('d-none');
    closeFloater.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}
