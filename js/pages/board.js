let preTaskCards = [];
let taskDataMap = {};
let boardContainers = [
  { id: 'toDo', emptyId: 'noTaskToDo' },
  { id: 'inProgress', emptyId: 'noTaskInProgress' },
  { id: 'awaitFeedback', emptyId: 'noTaskAwaitFeedback' },
  { id: 'done', emptyId: 'noTaskDone' }
]
let currentDraggedTaskId;
let addTaskStatusTarget;


function initBoard() {
  // loadPreTaskCards();
  renderTasks();
  console.log(taskDataMap);
}


async function getPreTaskCardFromDB() {
  const url = `${BASE_URL}board/preTask.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const tasks = await response.json();
    if (!tasks) return [];
    return Object.values(tasks);
  } catch (error) {
    console.error("Error when retrieving the tasks", error);
    return [];
  }
}


async function loadPreTaskCards() {
  preTaskCards = await getPreTaskCardFromDB();
  renderPreTaskCard();
}


// function renderPreTaskCard() {
//   let taskCard = document.getElementById('inProgress');
//   let hideNoTask = document.getElementById('noTaskInProgress');
//   if (preTaskCards.length === 0) {
//     hideNoTask.classList.remove('d-none');
//     return;
//   }
//   taskCard.innerHTML = "";
//   preTaskCards.forEach(task => {
//     let taskHTML = createTaskCard(task.category, task.title, task.description, task.assigned);
//     taskCard.innerHTML += taskHTML;
//   })
// }


function loadTaskFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}


function progressSubtasks(task) {
  let totalSubtasks = task.subtasks?.length || 0;
  let completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  let progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  let progressColor = progressPercent === 100 ? '#00cc66' : '#4589ff';
  let hideProgressBar = totalSubtasks === 0 ? 'display:none;' : '';
  return { totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar };
}


function getInitialsTaskCard(task) {
  let html = '';
  for (let contact of task.contacts) {
    html += `
    <div class="card-badge" style="background-color: ${contact.color}">
        <span>${contact.initials}</span>
      </div>
    `
  }
  return html;
}

function getNamesTaskCardTemp() {

}


function prepareTaskData(task) {
  let initialsHTML = getInitialsTaskCard(task);
  let { totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar } = progressSubtasks(task);
  taskDataMap[task.id] = {
    task,
    initialsHTML,
    totalSubtasks,
    completedSubtasks,
    progressPercent,
    progressColor,
    hideProgressBar
  };
}


function renderTasks() {
  let tasks = loadTaskFromStorage();
  boardContainers.forEach(({ id }) => {
    document.getElementById(id).innerHTML = '';
  });
  tasks.forEach(task => {
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


function openBoardCard(id) {
  let { task, initialsHTML, totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar } = taskDataMap[id];
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate(task, initialsHTML, totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar);
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

function changeBoardCardTemplate() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = editBoardCardTemplate();
}

function defaultBoardCardTemplate() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate();
}


function startDragging(id) {
  currentDraggedTaskId = id;
  document.getElementById(id).classList.add('dragging');
}


function allowDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.add('highlight');
}


function clearDropHighlight(event) {
  event.currentTarget.classList.remove('highlight');
}

document.addEventListener('dragend', globalDragEnd);


function globalDragEnd() {
  let noTaskContainer = document.getElementsByClassName('no-task');
  for (let i = 0; i < noTaskContainer.length; i++) {
    noTaskContainer[i].classList.remove('highlight');
  }
  let containers = document.getElementsByClassName('task-card-outside');
  for (let i = 0; i < containers.length; i++) {
    containers[i].classList.remove('dragging');
  }
}



function moveTo(newStatus) {
  let data = taskDataMap[currentDraggedTaskId];
  if (data && data.task) {
    data.task.status = newStatus;
    saveTaskDataMapToStorage();
    renderTasks();
  }
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