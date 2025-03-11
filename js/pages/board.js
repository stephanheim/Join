let preTaskCards = [];


function initBoard() {
  loadPreTaskCards();
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


function renderPreTaskCard() {
  let taskCard = document.getElementById('inProgress');
  let hideNoTask = document.getElementById('noTaskInProgress');
  if (preTaskCards.length === 0) {
    hideNoTask.classList.remove('d-none');
    return;
  }
  taskCard.innerHTML = "";
  preTaskCards.forEach(task => {
    let taskHTML = createTaskCard(task.category, task.title, task.description, task.assigned);
    taskCard.innerHTML += taskHTML;
  })
}


function openAddFloatingTask() {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut', 'd-none');
  addTask.classList.add('slideIn');
  setTimeout(() => {
    addTask.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}


function closeAddFloatingTask() {
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


function openBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate();
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

function getTaskValue(){
  let title = document.getElementById('addTaskTitle').value.trim();
  let description = document.getElementById('addTaskDescription').value.trim();
  let date = document.getElementById('addTaskDate').value.trim();
}