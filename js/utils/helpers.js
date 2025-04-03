/**
 * Fetches data from the specified URL
 *
 * @param {string} url - The URL from which to fetch the data
 * @param {object} options - Options for the fetch request (method, headers, body)
 * @return {Promise<object|undefined>} - A promise that resolves to a JSON object on success or `undefined` on failure
 */
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    return undefined;
  }
}

function isCheckboxChecked(type) {
  if (type === 'signup') {
    return document.getElementById('checkboxSignup').checked;
  }
  if (type === 'remember') {
    return document.getElementById('rememberMe').checked;
  }
}

function toggleRequiredInput(isFocused) {
  let border = document.getElementById('requiredInput');
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}

function toggleRequiredInput(inputElement, isFocused) {
  let border = inputElement.parentElement.parentElement;
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}

function toggleSubmitButton() {
  if (allFieldsValid()) {
    activateButton();
  } else {
    deactivateButton();
  }
}

function deactivateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = true;
  return button;
}

function activateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = false;
  return button;
}

function resetFormRegister() {
  const form = document.getElementById('formRegister');
  return form.reset();
}

function showSubMenu() {
  const submenu = document.getElementById('submenu');
  submenu.classList.toggle('d-none');
}

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInGuest');
  window.location.href = '../index.html';
}

function showDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('d-none', 'drop-down-hide');
  dropDownMenu.classList.add('drop-down-show');
}

function hideDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('drop-down-show');
  dropDownMenu.classList.add('drop-down-hide');
  setTimeout(() => {
    dropDownMenu.classList.add('d-none');
  }, 300);
}

function assignColorsToContacts(groupedContacts) {
  let colorizeIndex = 0;
  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    for (let j = 0; j < group.contacts.length; j++) {
      group.contacts[j].color = contactColors[colorizeIndex % contactColors.length];
      colorizeIndex++;
    }
  }
}

function prepareFormattedContacts() {
  formattedContactsArray = contactsArray.map((contact, index) => ({
    id: index + 1,
    name: contact.name,
    initials: getInitials(contact.name),
    color: contact.color,
  }));
}

function generateUniqueId() {
  return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function getPriorityIcon(priority) {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'urgent-red.svg';
    case 'medium':
      return 'medium-orange.svg';
    case 'low':
      return 'low-green.svg';
    default:
      return 'medium-orange.svg';
  }
}

function getCategoryColor(category) {
  switch (category.toLowerCase()) {
    case 'technical task':
      return '#1FD7C1';
    case 'user story':
      return '#0038FF';
  }
}

function loadTaskFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

async function loadTaskFromDB() {
  let data = await fetchData(BASE_URL + '/board/newTasks.json');
  if (!data) return [];
  return Object.values(data);
}

async function loadDefaultTaskFromDB() {
  let data = await fetchData(BASE_URL + '/board/default.json');
  if (!data) return [];
  return Object.values(data);
}

async function syncTasksFromDBToLocalStorage() {
  let userTasks = await loadTaskFromDB();
  let defaultTasks = await loadDefaultTaskFromDB();
  let allTasks = defaultTasks.concat(userTasks);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

function setActiveNavBoard() {
  let boardNav = document.getElementById('sumToBoard');
  if (boardNav) {
    setActiveNav(boardNav);
  }
}

function messageTaskAdded() {
  let msg = document.getElementById('overlayTaskAdded');
  if (!msg) return;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 1300);
}

function messageTaskAdded() {
  let msg = document.getElementById('overlayTaskAdded');
  if (!msg) return;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 1300);
}

function preventFormSubmitOnEnter() {
  let form = document.getElementById('addTaskForm');
  if (!form) {
    return;
  }
  let inputs = form.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && inputs[i].type !== 'submit') {
        event.preventDefault();
      }
    });
  }
}

const joinLogoMobile = document.querySelector('.start-join-logo img');
if (joinLogoMobile && window.innerWidth <= 600) {
  joinLogoMobile.src = './assets/img/join.svg';
  setTimeout(() => {
    joinLogoMobile.src = './assets/img/join_login.svg';
  }, 800);
}
