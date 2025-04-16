/**
 * Adds a new subtask from the input field if the input is not empty.
 *
 * @param {Event} event - The input event from pressing enter or clicking the add button.
 */
function addSubtaksFromInput(event) {
  let subtaskInputRef = document.getElementById('addTaskSubtasks');
  let subtaskNote = subtaskInputRef.value;
  if (subtaskNote.trim() !== '') {
    let newSubtask = { text: subtaskNote, completed: false };
    addSubtask.push(newSubtask);
    renderSubtask(newSubtask);
    resetSubtaskInput(event);
  }
}

/**
 * Handles the Enter key press within a subtask input field.
 *
 * This function detects whether the user is currently editing an existing subtask
 * or entering a new one. If an editable subtask input is found, it saves the edited
 * subtask using its index. Otherwise, it adds a new subtask from the input field.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered by key press.
 */
function handleSubtaskEnter(event) {
  if (event.key === 'Enter') {
    let editInput = document.querySelector('.input-container-edit input');
    if (editInput) {
      let id = editInput.id;
      let index = parseInt(id.split('-')[1]);
      saveEditedSubtask(index);
    } else {
      addSubtaksFromInput(event);
    }
  }
}