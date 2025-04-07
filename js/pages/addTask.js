let selectedPriorityValue = '';
let selectedContacts = [];
let selectedCategoryValue = '';
let addSubtask = [];
let addNewTask = [];

function initAddTask() {
  preventFormSubmitOnEnter();
  resetSelectCategory();
}

function getAddTaskValue() {
  let title = document.getElementById('addTaskTitle').value.trim();
  let description = document.getElementById('addTaskDescription').value.trim();
  let date = document.getElementById('addTaskDate').value.trim();
  let newTask = {
    id: generateUniqueId(),
    title,
    description,
    date,
    priority: selectedPriorityValue,
    contacts: Array.from(selectedContacts),
    category: selectedCategoryValue,
    subtasks: addSubtask,
  };
  addNewTask.push(newTask);
  return newTask;
}

function areTaskFieldsFilled() {
  let { title, date, category } = getTaskFieldValues();
  if (!title || !date || !category) {
    showFieldErrors();
    return false;
  }
  clearFieldErrors();
  return true;
}

function getTaskFieldValues() {
  let title = document.getElementById('addTaskTitle').value.trim();
  let date = document.getElementById('addTaskDate').value.trim();
  let category = selectedCategoryValue.trim();
  return { title, date, category };
}

function clearAddTask() {
  document.getElementById('addTaskTitle').value = '';
  document.getElementById('addTaskDescription').value = '';
  document.getElementById('addTaskDate').value = '';
  resetSelectCategory();
  resetContactsSelection();
  resetSubtask();
  resetSelectedPriority();
}

function openAddTaskFloating(status) {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  setTimeout(() => {
    preventFormSubmitOnEnter();
  }, 100);
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut', 'd-none');
  addTask.classList.add('slideIn');
  setTimeout(() => {
    addTask.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
  addTaskStatusTarget = status;
}

function closeAddTaskFloating() {
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


/* --- Auslagern unterehalb --- */


async function createNewTask(status) {
  if (!areTaskFieldsFilled()) return;
  let currentStatus = getTaskStatus(status);
  let newTask = initTaskWithStatus(currentStatus);
  await saveTaskToDB(newTask);
  addTaskToLocalStorage(newTask);
  clearAddTask();
  messageTaskAdded();
  showBoardAfterDelay();
}

function getTaskStatus(status) {
  return status || addTaskStatusTarget || 'toDo';
}

function initTaskWithStatus(status) {
  let task = getAddTaskValue();
  task.status = status;
  return task;
}

async function deleteTask(firebaseId, taskId) {
  let success = await deleteTaskInDB(firebaseId);
  if (!success) {
    deleteTaskInLocalStorage(firebaseId);
    delete taskDataMap[taskId]
    loadPageContentPath('board');
  }
}

function selectedPriority(prio, element) {
  buttonsColorSwitch(element);
  selectedPriorityValue = prio;
}

function buttonsColorSwitch(activeButton) {
  let buttons = activeButton.parentElement.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('isSelected');
  }
  activeButton.classList.add('isSelected');
}

function resetSelectedPriority() {
  let buttons = document.getElementsByClassName('button-prio');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('isSelected');
  }
  let defaultButton = document.getElementById('btn2');
  if (defaultButton) {
    defaultButton.classList.add('isSelected');
  }
  selectedPriorityValue = '';
}

function addedContacts(dropDownMenu, contacts) {
  contacts.forEach((contact, i) => {
    let { name, color, initials } = contact;
    let isChecked = selectedContacts.some((c) => c.id === contact.id);
    dropDownMenu.innerHTML += assignedToTemplate(name, color, initials, i, isChecked);
  });
}

function applySelectionStyles(contacts) {
  contacts.forEach((_, i) => updateSelectedStyle(document.getElementById(`innerDropmenu-${i}`), document.getElementById(`checkbox-${i}`)?.checked));
}

function searchContacts(searchTerm) {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  if (searchTerm.length < 2) {
    renderDropdownUser(dropDownMenu, formattedContactsArray);
    return;
  }
  let searchContacts = formattedContactsArray.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm.toLowerCase()));
  renderDropdownUser(dropDownMenu, searchContacts);
}

function getContacts(dropDownMenu) {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderDropdownUser(dropDownMenu);
}

function resetSelectCategory() {
  const selectedCategory = document.getElementById('selectedCategory');
  if (selectedCategory) {
    selectedCategory.innerText = 'Select task category';
    selectedCategoryValue = '';
  }
}

function renderSubtask(subtask) {
  let subtaskRef = document.getElementById('addedSubtask');
  let i = addSubtask.length - 1;
  subtaskRef.innerHTML += subtaskTemplate(i, subtask);
}

function addSubtaksFromInput(event) {
  let subtaskInputRef = document.getElementById('addTaskSubtasks');
  let subtaskNote = subtaskInputRef.value;
  if (subtaskNote.trim() !== '') {
    let newSubtask = { text: subtaskNote, completed: false };
    addSubtask.push(newSubtask);
    renderSubtask(newSubtask);
    resetSubtaskInput(event);
  }
}

function editSubtask(i) {
  let subtaskRef = document.getElementById(`subtask-${i}`);
  if (subtaskRef) {
    subtaskRef.outerHTML = editSubtaskTemplate(i, addSubtask[i]);
  }
}

function saveEditedSubtask(i) {
  let inputRef = document.getElementById(`editSubtask-${i}`);
  addSubtask[i].text = inputRef.value;
  let container = inputRef.closest('.input-container-edit');
  container.outerHTML = subtaskTemplate(i, addSubtask[i]);
}

function resetSubtaskInput(event) {
  event.stopPropagation();
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  let container = document.getElementById('inputContainer');
  inputField.value = '';
  inputField.placeholder = 'Add new subtask';
  plusIcon.classList.remove('d-none');
  container.classList.remove('active');
  if (otherIcons) {
    otherIcons.classList.add('d-none');
  }
}

function renderAllSubtasks() {
  let subtaskRef = document.getElementById('addedSubtask');
  subtaskRef.innerHTML = '';
  addSubtask.forEach((subtask, i) => {
    subtaskRef.innerHTML += subtaskTemplate(i, subtask);
  });
}

function deleteSubtask(i) {
  addSubtask.splice(i, 1);
  renderAllSubtasks();
}

function resetSubtask() {
  let subtaskRef = document.getElementById('addedSubtask');
  subtaskRef.innerHTML = '';
  addSubtask.length = [];
}

function formatDate(input) {
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';
  if (value.length > 4) {
    formattedValue = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
  } else if (value.length > 2) {
    formattedValue = value.substring(0, 2) + '/' + value.substring(2);
  } else {
    formattedValue = value;
  }
  input.value = formattedValue;
  return;
}

function toggleContactsSelection(event, index) {
  const checkbox = document.getElementById(`checkbox-${index}`);
  const container = document.getElementById(`innerDropmenu-${index}`);
  const isCheckbox = event.target === checkbox;
  const checked = isCheckbox ? checkbox.checked : !checkbox.checked;
  if (!checkbox || !container) return;
  if (!isCheckbox) {
    event.preventDefault();
    checkbox.checked = checked;
  }
  updateSelectedContacts(index, checked);
  updateSelectedStyle(container, checked);
}

function resetContactsSelection() {
  let initialContainer = document.getElementById('selectedInitials');
  initialContainer.innerHTML = '';
  selectedContacts.length = 0;
}

function updateSelectedContacts(index, isChecked) {
  let contact = formattedContactsArray[index];
  let contactIndex = selectedContacts.findIndex((c) => c.id === contact.id);
  if (isChecked && contactIndex === -1) {
    selectedContacts.push(contact);
  } else if (!isChecked && contactIndex !== -1) {
    selectedContacts.splice(contactIndex, 1);
  }
  renderSelectedInitials();
}

function updateSelectedStyle(element, isChecked) {
  element.classList.toggle('inner-dropmenu', !isChecked);
  element.classList.toggle('inner-dropmenu-checked', isChecked);
}

function renderSelectedInitials() {
  const initialsRef = document.getElementById('selectedInitials');
  initialsRef.innerHTML = '';
  for (let i = 0; i < selectedContacts.length; i++) {
    const initials = selectedContacts[i].initials;
    const initialsColor = selectedContacts[i].color;
    initialsRef.innerHTML += initialsTemplate(initials, initialsColor);
  }
}


