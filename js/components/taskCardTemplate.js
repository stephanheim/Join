function createTaskCard() {
  return `<div id="taskCard" class="task-card-outside">
    <div class="card-headline"><span>User Story</span></div>
    <div class="card-description">
      <span>Title</span>
      <p>Content...</p>
    </div>
    <div class="card-progress">
      <div id="progressBar" class="card-progress-bar" role="progressbar" style="width: 100%;"></div>
      <span>0/2 Subtasks</span>
    </div>
    <div class="card-badge-prio">
      <div class="card-badge">
        <div class="user-badge">
          <span>M</span>
        </div>
        <div class="user-badge -m-user-badge">
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