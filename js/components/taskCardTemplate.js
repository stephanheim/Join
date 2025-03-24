function createTaskCard(task) {
  let { initialsHTML, totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar } = taskDataMap[task.id];
  return `<div draggable="true" ondragstart="startDragging()" onclick="openBoardCard('${task.id}')" id="${task.id}"
    class="task-card-outside">
    <div class="card-headline" style="background-color:${getCategoryColor(task.category)};">
      <span>${task.category}</span>
    </div>
    <div class="card-description">
      <span>${task.title}</span>
      <p>${task.description}</p>
    </div>
    <div class="card-progress" style="${hideProgressBar}">
      <div class="card-progress-bar-container">
        <div class="card-progress-bar" id="progressBar" role="progressbar" style="width: ${progressPercent}%; background-color: ${progressColor};"></div>
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