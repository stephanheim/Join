/**
 * Loads the task list from local storage.
 *
 * Parses the JSON stored under the key `'tasks'`. If no data exists, returns an empty array.
 *
 * @returns {Array<Object>} - An array of task objects from local storage, or an empty array if none found.
 */
function loadTaskFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

/**
 * Adds a single task to the local storage.
 *
 * Retrieves the existing tasks from local storage, appends the new task,
 * and saves the updated list back to local storage under the key `'tasks'`.
 *
 * @param {Object} task - The task object to add.
 */
function addTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Deletes a task from local storage by its Firebase ID.
 *
 * Filters out the task with the specified `firebaseId` from the stored list
 * and saves the updated list back to local storage under the key `'tasks'`.
 *
 * @param {string} firebaseId - The Firebase ID of the task to delete.
 */
function deleteTaskInLocalStorage(firebaseId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter((task) => task.firebaseId !== firebaseId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Extracts all task objects from the `taskDataMap` and saves them to local storage.
 *
 * Converts the map of task entries to an array of task objects,
 * then stores them under the key `'tasks'` in local storage.
 */
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

/**
 * Synchronizes tasks from the Firebase Realtime Database to local storage.
 *
 * Loads both user-created tasks and default tasks from the database,
 * merges them into a single array, and saves the result to local storage
 * under the key `'tasks'`.
 *
 * @returns {Promise<void>} - A promise that resolves when the sync is complete.
 */
async function syncTasksFromDBToLocalStorage() {
  let userTasks = await loadTaskFromDB();
  let defaultTasks = await loadDefaultTaskFromDB();
  let allTasks = defaultTasks.concat(userTasks);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}
