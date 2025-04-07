function loadTaskFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function addTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskInLocalStorage(firebaseId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter((task) => task.firebaseId !== firebaseId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskDataMapToStorage() {
  let tastDataArray = Object.values(taskDataMap);
  let tasks = [];
  for (let i = 0; i < tastDataArray.length; i++) {
    let entry = tastDataArray[i];
    let task = entry.task;
    tasks.push(task);
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

async function syncTasksFromDBToLocalStorage() {
  let userTasks = await loadTaskFromDB();
  let defaultTasks = await loadDefaultTaskFromDB();
  let allTasks = defaultTasks.concat(userTasks);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}