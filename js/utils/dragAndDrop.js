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