let taskCard = {
  category: 'User Story',
  title: 'Kochwelt Page & Recipe Recommender',
  description: 'Build start page with recipe recommendation...',
  initials: '',
  prio: '',
};


function initBoard() {
  renderTaskCard();
}


function renderTaskCard() {
  let taskCard = document.getElementById('inProgress');
  let hideNoTask = document.getElementById('noTaskInProgress');
  taskCard.innerHTML = createTaskCard();
  hideNoTask.classList.add('d-none');
}


function openAddFloatingTask() {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut');
  addTask.classList.add('slideIn');
  addTask.classList.remove('d-none');
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
  boardCard.classList.remove('slideOut');
  boardCard.classList.add('slideIn');
  boardCard.classList.remove('d-none');
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
