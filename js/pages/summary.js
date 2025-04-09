function initSummary() {
  getSummaryData();
  loadContactsFromFirebase();
  checkLoginWelcome();
}

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

function countToDo(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'todo').length;
}

function countDone(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'done').length;
}

function countInProgress(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'inprogress').length;
}

function countAwaitingFeedback(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === 'awaitfeedback').length;
}

function countTotal(tasks) {
  return tasks.length;
}

function countUrgent(tasks) {
  return tasks.filter((task) => task.priority && task.priority.toLowerCase() === 'urgent').length;
}

function renderSummary(taskCounts) {
  document.getElementById('summaryContainer').innerHTML = generateSummaryHTML(taskCounts);
}
