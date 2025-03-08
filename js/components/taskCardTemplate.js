function createTaskCard(category, title, description, initials) {
  return `<div draggable="true" ondragstart="startDragging()" onclick="openBoardCard()" id="taskCard" class="task-card-outside">
    <div class="card-headline"><span>${category}</span></div>
    <div class="card-description">
      <span>${title}</span>
      <p>${description}</p>
    </div>
    <div class="card-progress">
      <div id="progressBar" class="card-progress-bar" role="progressbar" style="width: 100%;"></div>
      <span>0/2 Subtasks</span>
    </div>
    <div class="card-badge-prio">
      <div class="card-badge">
        <div class="user-badge">
          <span>${initials}</span>
        </div>
        <div class="user-badge -m-user-badge"
          <span>P</span>
        </div>
        <div class="user-badge -m-user-badge">
          <span>S</span>
        </div>
      </div>
      <div class="user-prio"><img src="../assets/icons/urgent-red.svg" alt=""></div>
    </div>
  </div>`;
}
