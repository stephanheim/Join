/**
 * Generates the HTML string for a draggable task card used on the board.
 * Includes category, title, description, progress bar (if applicable), assigned contacts, and priority icon.
 *
 * @param {Object} task - The task object containing task data (id, title, description, category, priority).
 * @returns {string} HTML string for the rendered task card.
 *
 * Required external data from taskDataMap[task.id]:
 * - initialsHTML {string} - HTML with the assigned users' initials.
 * - totalSubtasks {number} - Total number of subtasks.
 * - completedSubtasks {number} - Number of completed subtasks.
 * - progressPercent {number} - Progress in percent (0–100).
 * - progressColor {string} - Color of the progress bar.
 * - hideProgressBar {string} - Inline style string to hide/show the progress bar.
 */
function createTaskCard(task) {
  let { initialsHTML, totalSubtasks, completedSubtasks, progressPercent, progressColor, hideProgressBar } = taskDataMap[task.id];
  return `<div id="${task.id}" draggable="true" ondragstart="startDragging('${task.id}')" ondragend="globalDragEnd()" onclick="openBoardCard('${task.id}')"
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
        <div class="card-progress-bar" id="progressBar" role="progressbar"
          style="width: ${progressPercent}%; background-color: ${progressColor};"></div>
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