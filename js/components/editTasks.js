function changeBoardCardTemplate(id) {
  const { task } = taskDataMap[id];
  const subtasks = task.subtasks || [];
  const subtaskHTML = subtasks.map((subtasks, i) => subtaskTemplate(i, subtasks)).join('');
  const namesHTML = getNamesTaskCardTemp(task, true);
  const boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = editBoardCardTemplate(task, subtaskHTML, namesHTML);
}

function editSubtask(i) {
  let subtaskRef = document.getElementById(`subtask-${i}`);
  if (subtaskRef) {
    subtaskRef.outerHTML = editSubtaskTemplate(i, addSubtask[i]);
  }
}

function saveEditedSubtask(i) {
  let inputRef = document.getElementById(`editSubtask-${i}`);
  addSubtask[i].text = inputRef.value;
  let container = inputRef.closest('.input-container-edit');
  container.outerHTML = subtaskTemplate(i, addSubtask[i]);
}

function saveEditedTask(id) {
  let task = taskDataMap[id].task;

  let newTitle = document.getElementById('editTitle').value;
  let newDescription = document.getElementById('editDescription').value;
  let newDate = document.getElementById('addTaskDate').value;
  let newPriority = selectedPriorityValue;

  task.title = newTitle;
  task.description = newDescription;
  task.date = newDate;
  task.priority = newPriority;
  task.assigned = assignedContacts.slice();
  task.subtasks = addSubtask.slice();

  updateTaskDB(task);
  renderTasks();
  closeEditGoToBoardCard();
  messageTaskAdded();
}

function closeEditGoToBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.classList.add('d-none');
    boardCard.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
  selectedPriorityValue = '';
}

function closeEditBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.classList.add('d-none');
    boardCard.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
  selectedPriorityValue = '';
}

