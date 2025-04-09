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
  let prio = task.priority;

  task.title = newTitle;
  task.description = newDescription;
  task.date = newDate;
  if (newPriority === '') {
    task.priority = prio;
  } else {
    task.priority = newPriority;
  }
  task.contacts = Array.from(selectedContacts);
  task.subtasks = Array.from(addSubtask);

  updateEditTaskDB(task);
  prepareTaskData(task);
  updateSubTaskTaskCard(task.id)
  closeEditGoToBoardCard();
  messageTaskAdded();
}

async function updateEditTaskDB(task) {
  if (!task.firebaseId) return;
  let path = task.isDefault ? '/board/default' : '/board/newTasks';
  await updateTaskInFirebase(path, task.firebaseId, task);
  if (task.subtasks) {
    await updateTaskSubtasksDB(path, task);
  }
}

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

