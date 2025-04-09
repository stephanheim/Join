/**
 * Default task list used to prepopulate the application.
 * Each task contains metadata such as title, description, due date, priority, status, and subtasks.
 *
 * Properties:
 * - id {string} Unique identifier for the task
 * - isDefault {boolean} Indicates this is a predefined task
 * - title {string} Title of the task
 * - description {string} Detailed explanation of the task
 * - date {string} Due date of the task (format: DD/MM/YYYY)
 * - category {string} Category of the task (e.g., Meeting, Design)
 * - priority {string} Priority level (e.g., Medium, Urgent)
 * - status {string} Current status of the task (e.g., toDo, inProgress)
 * - contacts {Array} List of assigned contact objects (empty by default)
 * - subtasks {Array<Object>} List of subtasks with text and completion status
 *
 * @type {Array<Object>}
 */
const DEFAULT_TASKS = [
  {
    id: 'task-1743532919041-101',
    isDefault: true,
    title: 'Projekt Kick-off Meeting',
    description: 'Erstes Meeting zur Besprechung der Projektziele und des Entwicklungsplans für die Chat-App.',
    date: '01/02/2025',
    category: 'Meeting',
    priority: 'Medium',
    status: 'inProgress',
    contacts: [],
    subtasks: [
      { text: 'Agenda erstellen', completed: false },
      { text: 'Einladungen versenden', completed: false },
      { text: 'Protokoll vorbereiten', completed: false },
    ],
  },
  {
    id: 'task-1743532919041-102',
    isDefault: true,
    title: 'UI/UX Design entwerfen',
    description: 'Erstellung eines ansprechenden und benutzerfreundlichen Interface Designs für die Chat-App.',
    date: '03/02/2025',
    category: 'Design',
    priority: 'Medium',
    status: 'toDo',
    contacts: [],
    subtasks: [
      { text: 'Wireframes erstellen', completed: false },
      { text: 'Mockups entwerfen', completed: false },
      { text: 'Feedback einholen', completed: false },
    ],
  },
  {
    id: 'task-1743532919041-103',
    isDefault: true,
    title: 'Backend-Server einrichten',
    description: 'Aufbau der Server-Infrastruktur für die Echtzeit-Kommunikation in der Chat-App.',
    date: '05/02/2025',
    category: 'Technical Task',
    priority: 'Urgent',
    status: 'toDo',
    contacts: [],
    subtasks: [
      { text: 'Server konfigurieren', completed: false },
      { text: 'Datenbank einrichten', completed: false },
      { text: 'API Endpoints implementieren', completed: false },
    ],
  },
  {
    id: 'task-1743532919041-104',
    isDefault: true,
    title: 'Chat-Funktionalität entwickeln',
    description: 'Implementierung der Kernfunktion zum Senden und Empfangen von Nachrichten in der App.',
    date: '10/02/2025',
    category: 'User Story',
    priority: 'Urgent',
    status: 'inProgress',
    contacts: [],
    subtasks: [
      { text: 'Nachrichten Senden', completed: false },
      { text: 'Nachrichten Empfangen', completed: false },
      { text: 'Nachrichten Status anzeigen', completed: false },
    ],
  },
  {
    id: 'task-1743532919041-105',
    isDefault: true,
    title: 'App Test und Bugfixing',
    description: 'Durchführung von Tests und Behebung von Fehlern in der Chat-App vor der Markteinführung.',
    date: '15/02/2025',
    category: 'Testing',
    priority: 'Medium',
    status: 'toDo',
    contacts: [],
    subtasks: [
      { text: 'Unit Tests erstellen', completed: false },
      { text: 'Integrationstests durchführen', completed: false },
      { text: 'Fehlerberichte analysieren', completed: false },
      { text: 'Bugfixes implementieren', completed: false },
    ],
  },
];

/**
 * Uploads all predefined tasks (`DEFAULT_TASKS`) asynchronously to Firebase.
 * Each task is assigned a unique ID beforehand if none is available.
 * Uses `prepareAndUploadTask()` for processing each task.
 *
 * @returns {Promise<void>}
 */
async function uploadDefaultTasks() {
  for (let task of DEFAULT_TASKS) {
    await prepareAndUploadTask(task);
  }
}

/**
 * Prepares a task and uploads it to Firebase.
 * Adds a unique ID to the task if none exists.
 * Stores the ID returned by Firebase (`firebaseId`) in the task.
 *
 * @param {Object} task - The task to be uploaded.
 * @param {string} [task.id] - Optional local ID of the task.
 * @returns {Promise<void>}
 */
async function prepareAndUploadTask(task) {
  if (!task.id) {
    task.id = generateUniqueId();
  }
  const firebaseId = await postTaskToFirebase(task);
  if (firebaseId) {
    task.firebaseId = firebaseId;
  }
}
