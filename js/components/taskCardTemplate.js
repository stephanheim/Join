function createTaskCard(task) {
  let initialsHTML = getContactsInitials(task);
  let { totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar } = progressSubtasks(task);
  return `<div draggable="true" ondragstart="startDragging()" onclick="openBoardCard()" id="task${task.id}"
    class="task-card-outside">
    <div class="card-headline">
      <span>${task.category}</span>
    </div>
    <div class="card-description">
      <span>${task.title}</span>
      <p>${task.description}</p>
    </div>
    <div class="card-progress" style="${hideProgressBar}">
      <div class="card-progress-bar-container">
        <div class="card-progress-bar" id="progressBar" role="progressbar" style="width: ${progressPercent}%;" background-color: ${progressColor}></div>
      </div>
      <span>${completedSubtasks} /${totalSubtasks} Subtasks</span>
    </div>
    <div class="card-badge-prio">
      <div class="card-badge-container">
        ${initialsHTML}
      </div>
      <div class="user-prio"><img src="../assets/icons/${getPriorityIcon(task.priority)}" /></div>
    </div>
  </div>`;
}