/**
 * Updates the content of the board card edit view with task data, including subtasks and assigned contacts.
 *
 * @param {string} id - The ID of the task to edit.
 */
function changeBoardCardTemplate(id) {
  const { task } = taskDataMap[id];
  const subtasks = task.subtasks || [];
  const subtaskHTML = subtasks.map((subtasks, i) => subtaskTemplate(i, subtasks)).join('');
  const namesHTML = getNamesTaskCardTemp(task, true);
  const boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = editBoardCardTemplate(task, subtaskHTML, namesHTML);
}

/**
 * Replaces a subtask element with its editable version.
 *
 * @param {number} i - Index of the subtask to edit.
 */
function editSubtask(i) {
  let subtaskRef = document.getElementById(`subtask-${i}`);
  if (subtaskRef) {
    subtaskRef.outerHTML = editSubtaskTemplate(i, addSubtask[i]);
  }
}

/**
 * Saves changes made to an editable subtask and updates the DOM.
 *
 * @param {number} i - Index of the subtask to save.
 */
function saveEditedSubtask(i) {
  let inputRef = document.getElementById(`editSubtask-${i}`);
  let newText = inputRef.value.trim();
  if (newText === '') {
    deleteSubtask();
    return;
  }
  addSubtask[i].text = newText;
  let container = inputRef.closest('.input-container-edit');
  container.outerHTML = subtaskTemplate(i, addSubtask[i]);
}

/**
 * Saves all changes to the edited task, updates Firebase and UI, and shows confirmation.
 *
 * @param {string} id - The ID of the task being edited.
 */
function saveEditedTask(id) {
  let task = taskDataMap[id].task;
  setTaskChanges(task);
  updateEditTaskDB(task);
  prepareTaskData(task);
  updateSubTaskTaskCard(task.id);
  closeEditGoToBoardCard();
  messageTaskAdded();
}

/**
 * Sets updated values from the edit form to the given task object.
 *
 * @param {Object} task - The task object to update.
 */
function setTaskChanges(task) {
  let newTitle = document.getElementById('editTitle').value;
  let newDescription = document.getElementById('editDescription').value;
  let newDate = document.getElementById('addTaskDate').value;
  task.title = newTitle;
  task.description = newDescription;
  task.date = newDate;
  ifNewOrOldPrio(task);
  task.contacts = Array.from(selectedContacts);
  task.subtasks = Array.from(addSubtask);
}

/**
 * Determines whether to keep the old priority or assign a new one to the task.
 *
 * @param {Object} task - The task object being edited.
 */
function ifNewOrOldPrio(task) {
  let newPriority = selectedPriorityValue;
  let prio = task.priority;
  if (newPriority === '') {
    task.priority = prio;
  } else {
    task.priority = newPriority;
  }
}

/**
 * Updates the edited task in Firebase, including subtasks if present.
 *
 * @param {Object} task - The task object to update in Firebase.
 * @returns {Promise<void>}
 */
async function updateEditTaskDB(task) {
  if (!task.firebaseId) return;
  let path = task.isDefault ? '/board/default' : '/board/newTasks';
  await updateTaskInFirebase(path, task.firebaseId, task);
  if (task.subtasks) {
    await updateTaskSubtasksDB(path, task);
  }
}

/**
 * Closes the edit board card overlay and resets the priority selection.
 */
function closeEditGoToBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.classList.add('d-none');
    boardCard.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
  selectedPriorityValue = '';
}

/**
 * Closes the board card overlay without saving and resets the priority selection.
 */
function closeEditBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.classList.add('d-none');
    boardCard.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
  selectedPriorityValue = '';
}
