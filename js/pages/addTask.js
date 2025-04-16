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
  loadContactsFromFirebase();
  preventFormSubmitOnEnter();
  clearAddTask();
  toggleResponsiveRequired();
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
    closeTaskCard();
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
 * Opens a hidden date picker input and transfers the selected date
 * into a visible text input in "dd/mm/yyyy" format.
 *
 * - Uses `showPicker()` in modern browsers to trigger the native date picker.
 * - Falls back to `focus()` in older browsers if `showPicker()` is unavailable.
 * - Formats the selected date after the user chooses it.
 *
 * Requirements:
 * - An <input type="date" id="hiddenDatePicker"> in the DOM
 * - A visible text input with id="addTaskDate"
 */
function openCalendar() {
  let hiddenPicker = document.getElementById('hiddenDatePicker');
  if (typeof hiddenPicker.showPicker === 'function') {
    hiddenPicker.showPicker();
  } else {
    hiddenPicker.focus();
  }
  hiddenPicker.onchange = function () {
    let date = hiddenPicker.value;
    if (date) {
      let [year, month, day] = date.split('-');
      document.getElementById('addTaskDate').value = `${day}/${month}/${year}`;
    }
  };
}
