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

