/**
 * Stores the currently selected priority for a task (e.g. 'urgent', 'medium', 'low').
 * Used when creating or editing a task.
 * @type {string}
 */
let selectedPriorityValue = '';

/**
 * Stores all currently selected contacts for the task being created or edited.
 * Each contact is an object with at least an `id`, `name`, `initials`, and `color`.
 * @type {Array<Object>}
 */
let selectedContacts = [];

/**
 * Stores the selected category value for the current task.
 * @type {string}
 */
let selectedCategoryValue = '';

/**
 * Stores the list of subtasks currently added to the task.
 * Each subtask is an object with `text` and `completed` properties.
 * @type {Array<{text: string, completed: boolean}>}
 */
let addSubtask = [];

/**
 * Stores all newly created tasks locally before they are synced or used.
 * @type {Array<Object>}
 */
let addNewTask = [];

/**
 * Initializes the add task form by preventing enter key form submission and clearing all fields.
 */
function initAddTask() {
  preventFormSubmitOnEnter();
  clearAddTask();
}

/**
 * Collects all task input values and returns a new task object.
 *
 * @returns {Object} The created task object.
 */
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

/**
 * Checks if required fields (title, date, category) are filled before creating a task.
 *
 * @returns {boolean} True if fields are filled, false otherwise.
 */
function areTaskFieldsFilled() {
  let { title, date, category } = getTaskFieldValues();
  if (!title || !date || !category) {
    showFieldErrors();
    return false;
  }
  clearFieldErrors();
  return true;
}

/**
 * Retrieves the values of the task form fields.
 *
 * @returns {{title: string, date: string, category: string}} The field values.
 */
function getTaskFieldValues() {
  let title = document.getElementById('addTaskTitle').value.trim();
  let date = document.getElementById('addTaskDate').value.trim();
  let category = selectedCategoryValue.trim();
  return { title, date, category };
}

/**
 * Clears all inputs and selections in the add task form.
 */
function clearAddTask() {
  document.getElementById('addTaskTitle').value = '';
  document.getElementById('addTaskDescription').value = '';
  document.getElementById('addTaskDate').value = '';
  clearFieldErrors();
  resetSelectCategory();
  resetContactsSelection();
  resetSubtask();
  resetSelectedPriority();
}

/**
 * Opens the floating task creation form and sets the target status for the new task.
 *
 * @param {string} status - The task status to assign (e.g. 'toDo', 'inProgress').
 */
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

/**
 * Closes the floating add task form and resets the body scroll behavior.
 */
function closeAddTaskFloating() {
  let floatingTask = document.getElementById('floatingAddTask');
  if (!floatingTask) return;
  document.body.style.overflow = 'auto';
  floatingTask.classList.remove('slideIn');
  floatingTask.classList.add('slideOut');
  floatingTask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    floatingTask.classList.add('d-none');
    floatingTask.innerHTML = '';
  }, 100);
}

/**
 * Creates and saves a new task if form inputs are valid.
 * Updates DB, local storage and UI accordingly.
 */
async function createNewTask() {
  if (!areTaskFieldsFilled()) return;
  let currentStatus = getTaskStatus();
  let newTask = initTaskWithStatus(currentStatus);
  await saveTaskToDB(newTask);
  addTaskToLocalStorage(newTask);
  clearAddTask();
  messageTaskAdded();
  showBoardAfterDelay();
  document.body.style.overflow = 'auto';
}

/**
 * Returns the status for the task based on the current form context.
 *
 * @returns {string} The task status (default: 'toDo').
 */
function getTaskStatus() {
  return addTaskStatusTarget || 'toDo';
}

/**
 * Initializes a task with the given status and input field values.
 *
 * @param {string} status - The task status to assign.
 * @returns {Object} The initialized task object.
 */
function initTaskWithStatus(status) {
  let task = getAddTaskValue();
  task.status = status;
  return task;
}

/**
 * Deletes a task from DB and localStorage if necessary, and updates the UI.
 *
 * @param {string} firebaseId - Firebase ID of the task.
 * @param {string} taskId - Local task ID.
 */
async function deleteTask(firebaseId, taskId) {
  let taskEntry = taskDataMap[taskId];
  if (!taskEntry || !taskEntry.task) return;
  let task = taskEntry.task;
  let success = await deleteTaskInDB(firebaseId, task.isDefault);
  if (!success) {
    deleteTaskInLocalStorage(firebaseId);
    delete taskDataMap[taskId];
    closeBoardCard();
    renderTasks();
  }
}

/**
 * Handles priority selection for a task and updates the UI state.
 *
 * @param {string} prio - The selected priority value.
 * @param {HTMLElement} element - The clicked button element.
 */
function selectedPriority(prio, element) {
  buttonsColorSwitch(element);
  selectedPriorityValue = prio;
}

/**
 * Switches the visual state of priority buttons.
 *
 * @param {HTMLElement} activeButton - The currently selected button.
 */
function buttonsColorSwitch(activeButton) {
  let buttons = activeButton.parentElement.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('isSelected');
  }
  activeButton.classList.add('isSelected');
}

/**
 * Resets the priority selection and restores the default button state.
 */
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

/**
 * Renders all available contacts inside the dropdown menu with their current selection status.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 * @param {Array<Object>} contacts - The array of contact objects to render.
 */
function addedContacts(dropDownMenu, contacts) {
  contacts.forEach((contact, i) => {
    let { name, color, initials } = contact;
    let isChecked = selectedContacts.some((c) => c.id === contact.id);
    dropDownMenu.innerHTML += assignedToTemplate(name, color, initials, i, isChecked);
  });
}

/**
 * Applies selection styles to all contacts in the dropdown based on checkbox state.
 *
 * @param {Array<Object>} contacts - Array of contact objects.
 */
function applySelectionStyles(contacts) {
  contacts.forEach((_, i) => {
    updateSelectedStyle(document.getElementById(`innerDropmenu-${i}`), document.getElementById(`checkbox-${i}`)?.checked);
  });
}

/**
 * Filters and renders contacts matching the search term or all contacts if input is too short.
 *
 * @param {string} searchTerm - The string to filter contacts by name.
 */
function searchContacts(searchTerm) {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  if (searchTerm.length < 2) {
    renderDropdownUser(dropDownMenu, formattedContactsArray);
    return;
  }
  let searchContacts = formattedContactsArray.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm.toLowerCase()));
  renderDropdownUser(dropDownMenu, searchContacts);
}

/**
 * Prepares, formats and renders the contact list in the dropdown.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 */
function getContacts(dropDownMenu) {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderDropdownUser(dropDownMenu);
}

/**
 * Resets the selected category value and updates the UI label.
 */
function resetSelectCategory() {
  const selectedCategory = document.getElementById('selectedCategory');
  if (selectedCategory) {
    selectedCategory.innerText = 'Select task category';
    selectedCategoryValue = '';
  }
}

/**
 * Renders a single subtask in the subtask list container.
 *
 * @param {Object} subtask - The subtask object to render.
 */
function renderSubtask(subtask) {
  let subtaskRef = document.getElementById('addedSubtask');
  let i = addSubtask.length - 1;
  subtaskRef.innerHTML += subtaskTemplate(i, subtask);
}

/**
 * Adds a new subtask from the input field if the input is not empty.
 *
 * @param {Event} event - The input event from pressing enter or clicking the add button.
 */
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

/**
 * Clears and resets the subtask input field and hides additional icons.
 *
 * @param {Event} event - The event that triggered the reset (e.g. click or keypress).
 */
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

/**
 * Renders all current subtasks in the container, refreshing the entire list.
 */
function renderAllSubtasks() {
  let subtaskRef = document.getElementById('addedSubtask');
  subtaskRef.innerHTML = '';
  addSubtask.forEach((subtask, i) => {
    subtaskRef.innerHTML += subtaskTemplate(i, subtask);
  });
}

/**
 * Deletes a subtask by index and re-renders the subtask list.
 *
 * @param {number} i - Index of the subtask to delete.
 */
function deleteSubtask(i) {
  addSubtask.splice(i, 1);
  renderAllSubtasks();
}

/**
 * Clears all subtasks and resets the subtask list in the UI.
 */
function resetSubtask() {
  let subtaskRef = document.getElementById('addedSubtask');
  subtaskRef.innerHTML = '';
  addSubtask.length = [];
}

/**
 * Formats a numeric date input into the format DD/MM/YYYY as the user types.
 * Non-digit characters are removed automatically.
 *
 * @param {HTMLInputElement} input - The input element containing the date string.
 */
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

/**
 * Toggles the selection of a contact and updates its visual state.
 *
 * @param {Event} event - The event triggered by the user interaction.
 * @param {number} index - The index of the contact in the formattedContactsArray.
 */
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

/**
 * Clears all selected contacts and resets the initials display area.
 */
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

/**
 * Updates the visual style of a contact item based on selection state.
 *
 * @param {HTMLElement} element - The container element of the contact item.
 * @param {boolean} isChecked - Whether the contact is selected.
 */
function updateSelectedStyle(element, isChecked) {
  element.classList.toggle('inner-dropmenu', !isChecked);
  element.classList.toggle('inner-dropmenu-checked', isChecked);
}

/**
 * Renders the initials of all selected contacts in the initials display container.
 */
function renderSelectedInitials() {
  const initialsRef = document.getElementById('selectedInitials');
  initialsRef.innerHTML = '';
  for (let i = 0; i < selectedContacts.length; i++) {
    const initials = selectedContacts[i].initials;
    const initialsColor = selectedContacts[i].color;
    initialsRef.innerHTML += initialsTemplate(initials, initialsColor);
  }
}
