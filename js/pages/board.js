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
 * Initializes the task board.
 * Loads tasks from Firebase into localStorage and renders them on the board.
 * Optionally, default tasks can be uploaded to Firebase if needed.
 *
 * @returns {Promise<void>}
 */
async function initBoard() {
  await syncTasksFromDBToLocalStorage();
  // await uploadDefaultTasks(); - only for loading default tasks on db
  renderTasks();
}

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

function prepareTaskData(task) {
  let initialsHTML = getInitialsTaskCard(task);
  let namesHTML = getNamesTaskCardTemp(task);
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

function progressSubtasks(task) {
  let totalSubtasks = task.subtasks?.length || 0;
  let completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  let progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  let progressColor = progressPercent === 100 ? '#00cc66' : '#4589ff';
  let hideProgressBar = totalSubtasks === 0 ? 'display:none;' : '';
  return { totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar };
}

function getInitialsTaskCard(task) {
  let html = '';
  let contacts = task.contacts || [];
  for (let contact of contacts) {
    html += `
    <div class="card-badge" style="background-color: ${contact.color}">
        <span>${contact.initials}</span>
      </div>
    `;
  }
  return html;
}

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

async function toggleSubtaskCompleted(taskId, subtaskIndex, isChecked) {
  let data = taskDataMap[taskId];
  if (!data) return;
  data.task.subtasks[subtaskIndex].completed = isChecked;
  await updateTaskDB(data.task);
  saveTaskDataMapToStorage();
  updateSubTaskTaskCard(taskId);
}

function updateSubTaskTaskCard(taskId) {
  let oldCard = document.getElementById(taskId);
  if (!oldCard) return;
  prepareTaskData(taskDataMap[taskId].task);
  let newCardHTML = createTaskCard(taskDataMap[taskId].task);
  oldCard.outerHTML = newCardHTML;
}

function handleClickFloatingTask(status) {
  const addTaskNav = findNavLinkByText('Add Task');
  if (window.innerWidth <= 1200) {
    loadAddTaskPage(status, addTaskNav);
  } else {
    openAddTaskFloating(status);
  }
}

function findNavLinkByText(text) {
  return Array.from(document.querySelectorAll('.nav')).find((link) => link.textContent.trim().includes(text));
}

function loadAddTaskPage(status, navElement) {
  loadPageContentPath('addTask').then(() => {
    addTaskStatusTarget = status;
    if (navElement) {
      setActiveNav(navElement);
    }
  });
}

function defaultBoardCardTemplate() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate();
}

async function updateTaskDB(task) {
  if (!task.firebaseId) return;
  let path = task.isDefault ? '/board/default' : '/board/newTasks';
  await updateTaskStatusDB(path, task);
  if (task.subtasks) {
    await updateTaskSubtasksDB(path, task);
  }
}

function searchTask(inputEvent) {
  let query = inputEvent.target.value.toLowerCase().trim();
  if (query) {
    let filteredTasks = taskMapToArray().filter(entry => matchesSearch(entry, query));
    renderFilteredTasks(filteredTasks);
  } else {
    renderTasks();
  }
}

function taskMapToArray() {
  return Object.values(taskDataMap);
}

function matchesSearch(entry, query) {
  let title = entry.task.title?.toLowerCase() || '';
  let description = entry.task.description?.toLowerCase() || '';
  return title.includes(query) || description.includes(query);
}

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
