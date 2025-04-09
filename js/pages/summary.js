/**
 * Initializes the summary page by loading tasks, contacts, and welcome info.
 */
function initSummary() {
  getSummaryData();
  loadContactsFromFirebase();
  checkLoginWelcome();
}

/**
 * Loads tasks from localStorage and renders summary counts.
 * Displays a message if no tasks are found.
 */
function getSummaryData() {
  let tasks = loadTaskFromStorage();
  let noTasks = document.getElementById('summaryContainer');
  if (tasks && tasks.length > 0) {
    let taskCounts = countTasksForSummary(tasks);
    renderSummary(taskCounts);
  } else {
    console.log('Keine Aufgaben gefunden.');
    noTasks.innerHTML += generateSummaryNoTasksHTML();
  }
}

/**
 * Aggregates task data into count values for different status categories.
 *
 * @param {Array<Object>} tasks - Array of all task objects.
 * @returns {{
*   total: number,
*   toDo: number,
*   done: number,
*   inProgress: number,
*   awaitingFeedback: number,
*   urgent: number
* }} Summary task counts.
*/
function countTasksForSummary(tasks) {
 return {
   total: countTotal(tasks),
   toDo: countToDo(tasks),
   done: countDone(tasks),
   inProgress: countInProgress(tasks),
   awaitingFeedback: countAwaitingFeedback(tasks),
   urgent: countUrgent(tasks),
 };
}

/**
 * Counts all tasks with status 'todo'.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {number} Number of 'To Do' tasks.
 */
function countToDo(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'todo').length;
}

/**
 * Counts all tasks with status 'done'.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {number} Number of 'Done' tasks.
 */
function countDone(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'done').length;
}

/**
 * Counts all tasks with status 'inprogress'.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {number} Number of 'In Progress' tasks.
 */
function countInProgress(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'inprogress').length;
}

/**
 * Counts all tasks with status 'awaitfeedback'.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {number} Number of 'Awaiting Feedback' tasks.
 */
function countAwaitingFeedback(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'awaitfeedback').length;
}

/**
 * Returns the total number of tasks.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {number} Total number of tasks.
 */
function countTotal(tasks) {
  return tasks.length;
}

/**
 * Counts all tasks with priority 'urgent'.
 *
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {number} Number of urgent tasks.
 */
function countUrgent(tasks) {
  return tasks.filter((task) => task.priority && task.priority.toLowerCase() === 'urgent').length;
}

/**
 * Renders the summary view using the given task count data.
 *
 * @param {Object} taskCounts - Object containing task count values.
 */
function renderSummary(taskCounts) {
  document.getElementById('summaryContainer').innerHTML = generateSummaryHTML(taskCounts);
}