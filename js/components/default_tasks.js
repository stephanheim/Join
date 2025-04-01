const DEFAULT_TASKS = [
  {
    id: 'task-1743532919041-467',
    isDefault: true,
    title: 'Test Task zum Editieren',
    description: 'Dies ist eine vordefinierte Aufgabe zum Bearbeiten.',
    date: '01/01/2025',
    category: 'User Story',
    priority: 'Low',
    status: 'toDo',
    contacts: [],
    subtasks: [
      { text: 'ausprobiert', completed: false },
      { text: 'es geht', completed: false }
    ]
  },
  {
    id: 'task-1743532919041-560',
    isDefault: true,
    title: 'Meeting vorbereiten',
    description: 'Folien und Agenda für das Teammeeting erstellen.',
    date: '05/01/2025',
    category: 'User Story',
    priority: 'Medium',
    status: 'inProgress',
    contacts: [],
    subtasks: [
      { text: 'Agenda schreiben', completed: false },
      { text: 'Slides gestalten', completed: false },
      { text: 'Meetingroom buchen', completed: false }
    ]
  },
  {
    id: 'task-1743532919041-921',
    isDefault: true,
    title: 'Code Review durchführen',
    description: 'PR #45 im Repository durchsehen.',
    date: '06/01/2025',
    category: 'Technical Task',
    priority: 'Urgent',
    status: 'awaitFeedback',
    contacts: [],
    subtasks: [
      { text: 'Review starten', completed: true },
      { text: 'Kommentare schreiben', completed: false }
    ]
  }
];


async function uploadDefaultTasks() {
  for (let task of DEFAULT_TASKS) {
    if (!task.id) {
      task.id = generateUniqueId();
    }
    const postUrl = BASE_URL + '/board/default.json';
    const response = await fetchData(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (response?.name) {
      task.firebaseId = response.name;
      await fetchData(`${BASE_URL}/board/default/${response.name}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseId: response.name }),
      });
    }
  }
}
