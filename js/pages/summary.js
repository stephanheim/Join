function initSummary() {
  loadContactsFromFirebase();

  let tasks = loadTaskFromStorage(); 
  if (tasks && tasks.length > 0) {
    let taskCounts = countTasksForSummary(tasks); 
    console.log(taskCounts); 
  } else {
    console.log("Keine Aufgaben gefunden.");
  }
}

function setActiveToBoard() {
  const toBoard = document.getElementById("sumToBoard");
  const removeSum = document.getElementById("removeActive");
  if (toBoard) {
    toBoard.classList.add("active");
    toBoard.style.pointerEvents = "none";
  }
  if (removeSum) {
    removeSum.classList.remove("active");
    removeSum.style.pointerEvents = "auto";
  }
}

function countTasksForSummary(tasks) {
  const total = countTotal(tasks);
  const toDo = countToDo(tasks);
  const done = countDone(tasks);
  const inProgress = countInProgress(tasks);
  const awaitingFeedback = countAwaitingFeedback(tasks);

  return {
    total,
    toDo,
    done,
    inProgress,
    awaitingFeedback,
  };
}

function countToDo(tasks) {
  return tasks.filter((task) => task.status.toLowerCase() === "toDo").length;
}

function countDone(tasks) {
  return tasks.filter((task) => task.status.toLowerCase() === "done").length;
}

function countInProgress(tasks) {
  return tasks.filter((task) => task.status.toLowerCase() === "inProgress").length;
}

function countAwaitingFeedback(tasks) {
  return tasks.filter((task) => task.status.toLowerCase() === "awaitFeedback").length;
}

function countTotal(tasks) {
  return tasks.length;
}
