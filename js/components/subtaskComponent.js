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