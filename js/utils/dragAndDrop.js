/**
 * Starts the dragging process by storing the dragged task ID
 * and adding a visual indicator to the dragged element.
 *
 * @param {string} id - The ID of the dragged task element.
 */
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

/**
 * Allows a dragged item to be dropped on the target element.
 * Prevents default behavior and renders the preview if needed.
 *
 * @param {DragEvent} event - The drag event.
 * @param {string} targetId - The ID of the drop target container.
 */
function allowDrop(event, targetId) {
  event.preventDefault();
  let container = document.getElementById(targetId);
  if (!container) return;
  renderPreview(container);
}

/**
 * Renders a drop preview indicator if it doesn't already exist.
 *
 * @param {HTMLElement} container - The container where the preview should appear.
 */
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

/**
 * Removes the drop preview indicator from the target container.
 *
 * @param {string} targetId - The ID of the container to clear.
 */
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

// Attach global drag end listener
document.addEventListener('dragend', globalDragEnd);

/**
 * Removes the 'dragging' class from all task elements when dragging ends.
 */
function globalDragEnd() {
  let taskCard = document.getElementsByClassName('task-card-outside');
  for (let i = 0; i < taskCard.length; i++) {
    taskCard[i].classList.remove('dragging');
  }
}

/**
 * Moves the currently dragged task to a new status column.
 * Updates task status in DB, saves to storage, and re-renders tasks.
 *
 * @param {string} newStatus - The new status to assign to the task (e.g., "toDo", "inProgress", "done").
 */
async function moveTo(newStatus) {
  let data = taskDataMap[currentDraggedTaskId];
  if (data && data.task) {
    data.task.status = newStatus;
    await updateTaskDB(data.task);
    saveTaskDataMapToStorage();
    renderTasks();
  }
}
