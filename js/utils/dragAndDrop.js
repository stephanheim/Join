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

/** 
 * === Mobile Touch Drag & Drop ===
 * Handles drag and drop on touch devices
 */

/**
 * Enables touch-based drag-and-drop functionality for mobile devices.
 * Attaches touch event handlers to the given task element.
 *
 * @param {HTMLElement} taskElement - The task card element to make draggable.
 */
function enableMobileDrag(taskElement) {
  taskElement.addEventListener('touchstart', (e) => handleTouchStart(e, taskElement));
  taskElement.addEventListener('touchmove', (e) => handleTouchMove(e, taskElement));
  taskElement.addEventListener('touchend', (e) => handleTouchEnd(e, taskElement));
}

/**
 * Handles the touch start event by storing initial touch coordinates
 * and adding the visual dragging indicator.
 *
 * @param {TouchEvent} e - The touchstart event.
 * @param {HTMLElement} element - The task element being dragged.
 */
function handleTouchStart(e, element) {
  element.dataset.startX = e.touches[0].clientX;
  element.dataset.startY = e.touches[0].clientY;
  element.classList.add('dragging');
}

/**
 * Updates the task element position based on the current touch position.
 *
 * @param {TouchEvent} e - The touchmove event.
 * @param {HTMLElement} element - The task element being dragged.
 */
function handleTouchMove(e, element) {
  e.preventDefault();
  let touch = e.touches[0];
  element.style.position = 'absolute';
  element.style.left = `${touch.clientX - 50}px`;
  element.style.top = `${touch.clientY - 50}px`;
  element.style.zIndex = '1000';
}

/**
 * Handles the touch end event by resetting styles and checking for drop target.
 *
 * @param {TouchEvent} e - The touchend event.
 * @param {HTMLElement} element - The task element being dragged.
 */
function handleTouchEnd(e, element) {
  resetDraggedElementStyle(element);
  checkDropZones(e.changedTouches[0], element);
}

/**
 * Resets the visual styles applied during the drag process.
 *
 * @param {HTMLElement} element - The task element to reset.
 */
function resetDraggedElementStyle(element) {
  element.classList.remove('dragging');
  element.style.position = '';
  element.style.left = '';
  element.style.top = '';
  element.style.zIndex = '';
}

/**
 * Checks if the dragged element was dropped inside a valid drop zone
 * and moves the task if so.
 *
 * @param {Touch} touch - The touch point at the end of the drag.
 * @param {HTMLElement} element - The dragged task element.
 */
function checkDropZones(touch, element) {
  document.querySelectorAll('.task-render-container').forEach((zone) => {
    let rect = zone.getBoundingClientRect();
    if (isTouchInside(touch, rect)) {
      zone.appendChild(element);
      moveTo(zone.id);
    }
  });
}

/**
 * Checks whether the touch point is inside the given bounding rectangle.
 *
 * @param {Touch} touch - The touch point.
 * @param {DOMRect} rect - The bounding client rectangle of the drop zone.
 * @returns {boolean} True if the touch is inside the rectangle, otherwise false.
 */
function isTouchInside(touch, rect) {
  return (
    touch.clientX >= rect.left &&
    touch.clientX <= rect.right &&
    touch.clientY >= rect.top &&
    touch.clientY <= rect.bottom
  );
}

