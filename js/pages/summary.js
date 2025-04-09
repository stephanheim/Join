function initSummary() {
  welcomeOverlayOnStart();
  getSummaryData();
  loadContactsFromFirebase();
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

function hideOverlayWithAnimation() {
  const overlay = document.getElementById('welcomeOverlay');
  if (!overlay) return;
  overlay.classList.add('fade-smart-out');
  setTimeout(() => {
    overlay.classList.add('d-none');
  }, 3000);
}

function showOverlay() {
  const overlay = document.getElementById('welcomeOverlay');
  if (!overlay) return;
  overlay.classList.remove('fade-smart-out');
  overlay.classList.remove('d-none');
}

function welcomeOverlayOnStart() {
  if (window.innerWidth <= 1200) {
    hideOverlayWithAnimation();
  } else {
    showOverlay();
  }
}

let overlayHasBeenHidden = false;

function handleOverlayOnResize() {
  const isSmall = window.innerWidth <= 1200;
  const isLarge = window.innerWidth > 1200;
  if (isSmall && !overlayHasBeenHidden) {
    hideOverlayWithAnimation();
    overlayHasBeenHidden = true;
  }
  if (isLarge) {
    showOverlay();
    overlayHasBeenHidden = false;
  }
}

window.addEventListener('DOMContentLoaded', welcomeOverlayOnStart);
window.addEventListener('resize', handleOverlayOnResize);

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
