let preTaskCards = [];
let taskDataMap = {};
let boardContainers = [
  { id: 'toDo', emptyId: 'noTaskToDo' },
  { id: 'inProgress', emptyId: 'noTaskInProgress' },
  { id: 'awaitFeedback', emptyId: 'noTaskAwaitFeedback' },
  { id: 'done', emptyId: 'noTaskDone' },
];
let currentDraggedTaskId;
let addTaskStatusTarget;

async function initBoard() {
  await syncTasksFromDBToLocalStorage();
  // await uploadDefaultTasks();
  renderTasks();
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
  loadPageContentPath('add_task').then(() => {
    addTaskStatusTarget = status;
    if (navElement) {
      setActiveNav(navElement);
    }
  });
}

function openBoardCard(id) {
  let { task, subtaskHTML, namesHTML } = taskDataMap[id];
  addSubtask = [...(task.subtasks || '')];
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate(task, subtaskHTML, namesHTML);
  document.body.style.overflow = 'hidden';
  boardCard.classList.remove('slideOut', 'd-none');
  boardCard.classList.add('slideIn');
  setTimeout(() => {
    boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

function closeBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.classList.add('d-none');
    boardCard.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}

function changeBoardCardTemplate(id) {
  const { task } = taskDataMap[id];
  const subtasks = task.subtasks || [];
  const subtaskHTML = subtasks.map((subtasks, i) => subtaskTemplate(i, subtasks)).join('');
  const namesHTML = getNamesTaskCardTemp(task, true);
  const boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = editBoardCardTemplate(task, subtaskHTML, namesHTML);
}

function defaultBoardCardTemplate() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate();
}

function startDragging(id) {
  currentDraggedTaskId = id;
  document.getElementById(id).classList.add('dragging');
}

function allowDrop(event, targetId) {
  event.preventDefault();
  let container = document.getElementById(targetId);
  if (!container) return;
  let exists = false;
  for (let i = 0; i < container.children.length; i++) {
    if (container.children[i].classList.contains('drop-preview')) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    let preview = document.createElement('div');
    preview.className = 'drop-preview';
    container.appendChild(preview);
  }
}

function allowDrop(event, targetId) {
  event.preventDefault();
  let container = document.getElementById(targetId);
  if (!container) return;
  renderPreview(container);
}

function renderPreview(container) {
  let exists = false;
  for (let i = 0; i < container.children.length; i++) {
    if (container.children[i].classList.contains('drop-preview')) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    container.innerHTML += `
      <div class="drop-preview"></div>
    `;
  }
}

function clearDropHighlight(targetId) {
  let container = document.getElementById(targetId);
  if (!container) return;
  for (let i = 0; i < container.children.length; i++) {
    if (container.children[i].classList.contains('drop-preview')) {
      container.removeChild(container.children[i]);
      break;
    }
  }
}

document.addEventListener('dragend', globalDragEnd);

function globalDragEnd() {
  let taskCard = document.getElementsByClassName('task-card-outside');
  for (let i = 0; i < taskCard.length; i++) {
    taskCard[i].classList.remove('dragging');
  }
}

async function moveTo(newStatus) {
  let data = taskDataMap[currentDraggedTaskId];
  if (data && data.task) {
    data.task.status = newStatus;
    await updateTaskDB(data.task);
    saveTaskDataMapToStorage();
    renderTasks();
  }
}

async function updateTaskDB(task) {
  if (!task.firebaseId) return;

  let path = task.isDefault ? '/board/default' : '/board/newTasks';
  const idUrl = BASE_URL + `${path}/${task.firebaseId}.json`;
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: task.status,
      subtasks: task.subtasks,
    }),
  };
  await fetchData(idUrl, options);
}

function saveTaskDataMapToStorage() {
  let tastDataArray = Object.values(taskDataMap);
  let tasks = [];
  for (let i = 0; i < tastDataArray.length; i++) {
    let entry = tastDataArray[i];
    let task = entry.task;
    tasks.push(task);
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
