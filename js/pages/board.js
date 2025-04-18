/**
 * A map storing task data by task ID for quick access and rendering.
 * @type {Object.<string, Object>}
 */
let taskDataMap = {};

/**
 * The ID of the task currently being dragged.
 * Used for drag-and-drop operations.
 * @type {string|undefined}
 */
let currentDraggedTaskId;

/**
 * The target status used when adding a new task to the board.
 * This determines which column the task should appear in.
 * @type {string|undefined}
 */
let addTaskStatusTarget;

/**
 * Contains information about each board column and the corresponding empty state element ID.
 * @type {{id: string, emptyId: string}[]}
 */
let boardContainers = [
  { id: 'toDo', emptyId: 'noTaskToDo' },
  { id: 'inProgress', emptyId: 'noTaskInProgress' },
  { id: 'awaitFeedback', emptyId: 'noTaskAwaitFeedback' },
  { id: 'done', emptyId: 'noTaskDone' },
];

/**
 * Initializes the task board by loading contacts and tasks,
 * synchronizing with Firebase, preparing task data, and rendering the board.
 *
 * @returns {Promise<void>}
 */
async function initBoard() {
  loadContactsFromFirebase();
  await syncTasksFromDBToLocalStorage();
  // await uploadDefaultTasks(); - only for loading default tasks on db
  fillTaskDataMap();
  renderTasks();
}

/**
 * Renders all tasks from localStorage into the respective board columns (ToDo, InProgress, etc.).
 * Clears containers before re-rendering and updates empty-state visibility.
 */
function renderTasks() {
  let tasks = loadTaskFromStorage();
  boardContainers.forEach(({ id }) => {
    document.getElementById(id).innerHTML = '';
  });
  tasks.forEach((task) => {
    prepareTaskData(task);
    let container = document.getElementById(task.status);
    container.innerHTML += createTaskCard(task);
  });
  noTaskVisibility();
}

/**
 * Prepares a task by generating and storing reusable HTML fragments and progress values.
 * Stores the prepared data in taskDataMap for efficient access.
 *
 * @param {Object} task - The task object to prepare.
 */
function prepareTaskData(task) {
  let initialsHTML = getInitialsTaskCard(task);
  let namesHTML = getNamesTaskCardTemp(task, true);
  let subtaskHTML = getSubtaskCardTemp(task);
  let { totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar } = progressSubtasks(task);
  taskDataMap[task.id] = {
    task,
    subtaskHTML,
    initialsHTML,
    namesHTML,
    totalSubtasks,
    completedSubtasks,
    progressPercent,
    progressColor,
    hideProgressBar,
  };
}

/**
 * Toggles visibility of "no tasks" messages in each board column.
 */
function noTaskVisibility() {
  boardContainers.forEach(({ id, emptyId }) => {
    let container = document.getElementById(id);
    let empty = document.getElementById(emptyId);
    if (container.children.length === 0) {
      empty.style.display = 'flex';
    } else {
      empty.style.display = 'none';
    }
  });
}

/**
 * Calculates subtask progress details for a task.
 *
 * @param {Object} task - The task containing subtasks.
 * @returns {Object} Progress data including total, completed, percent, color and visibility.
 */
function progressSubtasks(task) {
  let totalSubtasks = task.subtasks?.length || 0;
  let completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  let progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  let progressColor = progressPercent === 100 ? '#00cc66' : '#4589ff';
  let hideProgressBar = totalSubtasks === 0 ? 'display:none;' : '';
  return { totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar };
}

/**
 * Generates HTML string with contact initials for a task card.
 * Shows not more than 5 initials, others with +x
 * @param {Object} task - The task object with contacts.
 * @returns {string} HTML string of initials badges.
 */
function getInitialsTaskCard(task) {
  let html = "";
  let contacts = task.contacts || [];
  const maxVisible = 5;
  contacts.slice(0, maxVisible).forEach((contact) => {
    html += contactBadgeTemplate(contact);
  });
  if (contacts.length > maxVisible) {
    const remaining = contacts.length - maxVisible;
    html += moreContactsBadgeTemplate(remaining);
  }
  return html;
}

/**
 * Generates the contact section HTML for a task card (optionally without names).
 *
 * @param {Object} task - The task with contacts.
 * @param {boolean} [hideNames=false] - Whether to hide contact names.
 * @returns {string} HTML string.
 */
function getNamesTaskCardTemp(task, hideNames = false) {
  let html = '';
  let contacts = task.contacts || [];
  for (let contact of contacts) {
    html += `
    <div class="contact-section">
      <div class="circle-content" style="background-color: ${contact.color}">
        <span>${contact.initials}</span>
      </div>
      <div>
      ${hideNames ? '' : `<div><span>${contact.name}</span></div>`}
      </div>
    </div>
    `;
  }
  return html;
}

/**
 * Creates HTML for all subtasks of a task, including checkbox state.
 *
 * @param {Object} task - The task object with subtasks.
 * @returns {string} HTML string for subtasks.
 */
function getSubtaskCardTemp(task) {
  let html = '';
  let subtasks = task.subtasks || [];
  subtasks.forEach((subtask, index) => {
    html += `
      <div class="subtask">
        <div class="checkbox">
          <input type="checkbox" onchange="toggleSubtaskCompleted('${task.id}', ${index}, this.checked)" ${subtask.completed ? 'checked' : ''}>
        </div>
        <div>
          <p>${subtask.text}</p>
        </div>
      </div>`;
  });
  return html;
}

/**
 * Toggles a subtask's completion status, updates DB, localStorage and task card UI.
 *
 * @param {string} taskId - ID of the task.
 * @param {number} subtaskIndex - Index of the subtask.
 * @param {boolean} isChecked - New completion state.
 */
async function toggleSubtaskCompleted(taskId, subtaskIndex, isChecked) {
  let data = taskDataMap[taskId];
  if (!data) return;
  data.task.subtasks[subtaskIndex].completed = isChecked;
  await updateTaskDB(data.task);
  saveTaskDataMapToStorage();
  updateSubTaskTaskCard(taskId);
}

/**
 * Updates a single task card in the DOM after a subtask change.
 *
 * @param {string} taskId - ID of the task to update.
 */
function updateSubTaskTaskCard(taskId) {
  let oldCard = document.getElementById(taskId);
  if (!oldCard) return;
  prepareTaskData(taskDataMap[taskId].task);
  let newCardHTML = createTaskCard(taskDataMap[taskId].task);
  oldCard.outerHTML = newCardHTML;
}

/**
 * Updates a task and its subtasks in Firebase, depending on whether it's default or new.
 *
 * @param {Object} task - The task to update.
 */
async function updateTaskDB(task) {
  if (!task.firebaseId) return;
  let path = task.isDefault ? '/board/default' : '/board/newTasks';
  await updateTaskStatusDB(path, task);
  if (task.subtasks) {
    await updateTaskSubtasksDB(path, task);
  }
}

/**
 * Filters all tasks based on search input and re-renders the board.
 *
 * @param {Event} inputEvent - The input event from the search field.
 */
function searchTask(inputEvent) {
  let query = inputEvent.target.value.toLowerCase().trim();
  if (query) {
    let filteredTasks = taskMapToArray().filter(entry => matchesSearch(entry, query));
    renderFilteredTasks(filteredTasks);
  } else {
    renderTasks();
  }
}

/**
 * Converts the taskDataMap object into an array of task entries.
 *
 * @returns {Array<Object>} Array of task data entries.
 */
function taskMapToArray() {
  return Object.values(taskDataMap);
}

/**
 * Checks if a task entry matches the given search query based on title or description.
 *
 * @param {Object} entry - A single entry from taskDataMap.
 * @param {string} query - The lowercase search string.
 * @returns {boolean} True if title or description contains the query.
 */
function matchesSearch(entry, query) {
  let title = entry.task.title?.toLowerCase() || '';
  let description = entry.task.description?.toLowerCase() || '';
  return title.includes(query) || description.includes(query);
}

/**
 * Renders only the tasks from the given filtered list into the board.
 * Also handles visibility of the empty state message.
 *
 * @param {Array<Object>} filteredTasks - Array of filtered task entries to render.
 */
function renderFilteredTasks(filteredTasks) {
  boardContainers.forEach(({ id }) => {
    document.getElementById(id).innerHTML = '';
  });
  const emptyMessage = document.getElementById('emptyId');
  if (filteredTasks.length === 0) {
    emptyMessage.style.display = 'flex';
  } else {
    emptyMessage.style.display = 'none';
    filteredTasks.forEach((entry) => {
      prepareTaskData(entry.task);
      let container = document.getElementById(entry.task.status);
      container.innerHTML += createTaskCard(entry.task);
    });
  }
  noTaskVisibility();
}