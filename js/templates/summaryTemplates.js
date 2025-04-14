/**
 * Generates the HTML for the summary dashboard with actual task statistics.
 * Includes sections for to-do, done, urgent, upcoming deadline, total tasks, in progress, and awaiting feedback.
 *
 * @param {Object} taskCounts - Object containing task counts for various categories.
 * @param {number} taskCounts.toDo - Number of tasks in "To-do".
 * @param {number} taskCounts.done - Number of tasks in "Done".
 * @param {number} taskCounts.urgent - Number of "Urgent" tasks.
 * @param {number} taskCounts.total - Total number of tasks.
 * @param {number} taskCounts.inProgress - Number of tasks "In Progress".
 * @param {number} taskCounts.awaitingFeedback - Number of tasks "Awaiting Feedback".
 * @returns {string} HTML string for the summary dashboard.
 */
function generateSummaryHTML(taskCounts) {
  return `
<div class="row-top">
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="todone-div hoverable box-shadow">
            <img src="../assets/img/pencil.svg" class="imgs-todo">
            <div class="numbers-div">
              <span class="number">${taskCounts.toDo}</span><span class="text-todo">To-do</span>
            </div>
          </div>
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="todone-div hoverable box-shadow">
            <img src="../assets/img/done.svg" class="imgs-todo">
            <div class="numbers-div">
              <span class="number">${taskCounts.done}</span>
              <span class="text-todo">Done</span>
            </div>
          </div>
        </div>
        <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="row-middle hoverable box-shadow">
          <div class="urgent-div">
            <img src="../assets/img/urgent.svg" class="img-urgent no-invert">
            <div class="numbers-div">
              <span class="number">${taskCounts.urgent}</span>
              <span class="text-urgent">Urgent</span>
            </div>
          </div>
          <div class="middle-sep"></div>
          <div class="date-div"><span class="text-date">October 16, 2026</span> <span class="text-urgent">Upcoming
              Deadline</div>
        </div>
        <div class="row-bottom">
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
            <div class="numbers-toDo">
              <span class="number">${taskCounts.total}</span>
              <span class="text-todo">Tasks in Board</span>
            </div>
          </div>
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
            <div class="numbers-toDo">
              <span class="number">${taskCounts.inProgress}</span>
              <span class="text-todo">Tasks in Progress</span>
            </div>
          </div>
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
            <div class="numbers-toDo">
              <span class="number">${taskCounts.awaitingFeedback}</span>
              <span class="text-todo">Awaiting Feedback</span>
            </div>
          </div>
        </div>
`;
}

/**
 * Generates the HTML for the summary dashboard when no tasks exist.
 * All values are displayed as 0 with the same layout as the populated summary.
 *
 * @returns {string} HTML string for the empty summary dashboard.
 */
function generateSummaryNoTasksHTML() {
  return `
  <div class="row-top">
    <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="todone-div hoverable box-shadow">
      <img src="../assets/img/pencil.svg" class="imgs-todo">
      <div class="numbers-div">
        <span class="number">0</span><span class="text-todo">To-do</span>
      </div>
    </div>
    <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="todone-div hoverable box-shadow">
      <img src="../assets/img/done.svg" class="imgs-todo">
      <div class="numbers-div">
        <span class="number">0</span>
        <span class="text-todo">Done</span>
      </div>
    </div>
  </div>
  <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="row-middle hoverable box-shadow">
    <div class="todone-div">
      <img src="../assets/img/urgent.svg" class="img-urgent no-invert">
      <div class="numbers-div">
        <span class="number">0</span>
        <span class="text-urgent">Urgent</span>
      </div>
    </div>
    <div class="middle-sep"></div>
    <div class="date-div"><span class="text-date">October 16, 2026</span> <span class="text-urgent">Upcoming
        Deadline</div>
  </div>
  <div class="row-bottom">
    <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
      <div class="numbers-toDo">
        <span class="number">0</span>
        <span class="text-todo">Tasks in Board</span>
      </div>
    </div>
    <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
      <div class="numbers-toDo">
        <span class="number">0</span>
        <span class="text-todo">Tasks in Progress</span>
      </div>
    </div>
    <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
      <div class="numbers-toDo">
        <span class="number">0</span>
        <span class="text-todo">Awaiting Feedback</span>
      </div>
    </div>
  </div>
  `;
}