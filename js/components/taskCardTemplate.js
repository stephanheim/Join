function createTaskCard(task) {
  let initialsHTML = getContactsInitials(task);
  return `<div draggable="true" ondragstart="startDragging()" onclick="openBoardCard()" id="task${task.id}"
    class="task-card-outside">
    <div class="card-headline"><span>${task.category}</span></div>
    <div class="card-description">
      <span>${task.title}</span>
      <p>${task.description}</p>
    </div>
    <div class="card-progress">
      <div id="progressBar" class="card-progress-bar" role="progressbar" style="width: 100%;"></div>
      <span>0/2 Subtasks</span>
    </div>
    <div class="card-badge-prio">
      ${initialsHTML}
      <div class="user-prio"><img src="../assets/icons/${getPriorityIcon(task.priority)}" /></div>
    </div>
  </div>`;
}
