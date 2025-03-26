function initSummary() {
  loadContactsFromFirebase();
  let tasks = loadTaskFromStorage();
  if (tasks && tasks.length > 0) {
    let taskCounts = countTasksForSummary(tasks);
    console.log(taskCounts);
    renderSummary(taskCounts);
  } else {
    console.log("Keine Aufgaben gefunden.");
  }
}

function countTasksForSummary(tasks) {
  return {
    total: countTotal(tasks),
    toDo: countToDo(tasks),
    done: countDone(tasks),
    inProgress: countInProgress(tasks),
    awaitingFeedback: countAwaitingFeedback(tasks),
  };
}

function countToDo(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === "todo").length;
}

function countDone(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === "done").length;
}

function countInProgress(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === "inprogress").length;
}

function countAwaitingFeedback(tasks) {
  return tasks.filter((task) => task.status && task.status.toLowerCase() === "awaitfeedback").length;
}

function countTotal(tasks) {
  return tasks.length;
}

function renderSummary(taskCounts) {
  document.getElementById("summary-container").innerHTML = generateSummaryHTML(taskCounts);
}
