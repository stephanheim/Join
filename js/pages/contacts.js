let contactsArray = [];
const contactColors = ['#ff7a01', '#9327ff', '#6e52ff', '#fc71ff', '#ffbb2c', '#20d7c2', '#462f8a', '#ff4646'];

function initContacts() {
  checkAndAddCurrentUser();
  getGroupedContacts();
  onclickShowAnimateContact();
}

async function loadContactsFromFirebase() {
  try {
    let contactsResponse = await getAllContacts();
    contactsArray = [];
    if (contactsResponse.contacts) {
      let contacts = contactsResponse.contacts;
      await getDetailInfo(contacts);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Kontakte', error);
  }
}

async function getAllContacts() {
  let response = await fetch(`${BASE_URL}.json`);
  return await response.json();
}

async function getDetailInfo(contacts) {
  let userIds = Object.keys(contacts);
  for (let i = 0; i < userIds.length; i++) {
    let contactId = userIds[i];
    let contact = contacts[contactId];

    contactsArray.push({
      id: contactId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  }
}

function sortContacts() {
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  return groupContactsByLetter();
}

function groupContactsByLetter() {
  let groupedByLetter = [];
  let letterGroup = null;
  contactsArray.forEach((contact) => {
    let firstLetter = contact.name[0].toUpperCase();
    if (letterGroup !== firstLetter) {
      letterGroup = firstLetter;
      groupedByLetter.push({ group: letterGroup, contacts: [] });
    }
    groupedByLetter[groupedByLetter.length - 1].contacts.push(contact);
  });
  return groupedByLetter;
}

function getInitials(name) {
  let nameParts = name.split(' ');
  return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
}

function assignColorsToContacts(groupedContacts) {
  let colorizeIndex = 0;
  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    for (let j = 0; j < group.contacts.length; j++) {
      group.contacts[j].color = contactColors[colorizeIndex % contactColors.length];
      colorizeIndex++;
    }
  }
}

function getGroupedContacts() {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderContacts(groupedContacts);
}

function renderContacts(groupedContacts) {
  let contactList = document.getElementById('contacts-div');
  contactList.innerHTML = '';
  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    contactList.innerHTML += generateGroupHTML(group.group);
    for (let j = 0; j < group.contacts.length; j++) {
      let contact = group.contacts[j];
      let initials = getInitials(contact.name);
      contactList.innerHTML += generateContactsHTML(contact, initials);
    }
  }
}

async function createNewContact(name, email, phone) {
  let newContact = { name, email, phone };
  let response = await postToFirebase(newContact);
  if (!response) return console.error('Fehler beim Hinzufügen des Kontakts');
  await processNewContact(response.id);
}

async function processNewContact(contactId) {
  await loadContactsFromFirebase();
  getGroupedContacts();
  document.getElementById('contactForm').reset();
  animateCloseContact();
  setTimeout(() => {
    highlightContact(contactId);
    showContactInfo(contactId);
    scrollToContact(contactId);
  }, 100);
  showSuccessMessage();
}

function scrollToContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  if (contactElement) {
    contactElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function getFormValues() {
  return {
    name: document.getElementById('addContName').value.trim(),
    email: document.getElementById('addContMail').value.trim(),
    phone: document.getElementById('addContPhone').value.trim(),
  };
}

function showContactInfo(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  clearHighlightContact();
  highlightContact(contactId);
  showGlanceWindow(contact);
  showResponsiveLayout(contactId);
}

async function deleteContact(contactId) {
  try {
    await fetch(`${BASE_URL}/contacts/${contactId}.json`, { method: 'DELETE' });
    contactsArray = contactsArray.filter((contact) => contact.id !== contactId);
    closeEditFloater();
    document.getElementById('cnt-glance-contact').style.display = 'none';
    await loadContactsFromFirebase();
    getGroupedContacts();
    await updateAssignedContactsDB(contactId)
  } catch (error) {
    console.error('Fehler beim Löschen des Kontakts:', error);
  }
  backToList();
}

/**
 * Updates all tasks in Firebase by removing a deleted contact from each.
 * Iterates over predefined task paths.
 *
 * @param {string} deletedContactId - The ID of the contact to remove from all tasks.
 * @returns {Promise<void>}
 */
async function updateAssignedContactsDB(deletedContactId) {
  let taskPaths = ['/board/newTasks', '/board/default'];
  for (let path of taskPaths) {
    await updateTasksInPath(path, deletedContactId);
  }
}

/**
 * Handles fetching and updating all tasks within a specific Firebase path.
 *
 * @param {string} path - Firebase path (e.g., '/board/newTasks').
 * @param {string} deletedContactId - The ID of the contact to remove.
 * @returns {Promise<void>}
 */
async function updateTasksInPath(path, deletedContactId) {
  try {
    let tasksData = await fetchTasksFromPath(path);
    if (!tasksData) return;
    for (let taskKey in tasksData) {
      await updateTaskIfContactRemoved(path, taskKey, tasksData[taskKey], deletedContactId);
    }
  } catch (error) {
    console.error(`Error updating path ${path}:`, error);
  }
}

/**
 * Processes a single task by removing the deleted contact if present.
 * Updates the task in Firebase if changes occurred.
 *
 * @param {string} path - Firebase path where the task is stored.
 * @param {string} key - Task key (Firebase ID).
 * @param {Object} task - The task object.
 * @param {string} deletedContactId - ID of the contact to remove.
 * @returns {Promise<void>}
 */
async function updateTaskIfContactRemoved(path, key, task, deletedContactId) {
  if (!Array.isArray(task.contacts)) return;
  let updatedContacts = filterDeletedContact(task.contacts, deletedContactId);
  if (!contactsChanged(task.contacts, updatedContacts)) return;
  task.contacts = updatedContacts;
  await updateTaskInFirebase(path, key, task);
}

/**
 * Returns a filtered contact list without the deleted contact.
 *
 * @param {Object[]} contacts - Original list of contact objects.
 * @param {string} deletedId - ID of the contact to remove.
 * @returns {Object[]} - Filtered list of contacts.
 */
function filterDeletedContact(contacts, deletedId) {
  return contacts.filter(contact => contact.id !== deletedId);
}

/**
 * Checks whether the contact list has changed after filtering.
 *
 * @param {Object[]} original - Original contact list.
 * @param {Object[]} filtered - Filtered contact list.
 * @returns {boolean} - True if list length differs (i.e., contact was removed).
 */
function contactsChanged(original, filtered) {
  return original.length !== filtered.length;
}

async function updateContact(contactId) {
  try {
    let updatedContact = getUpdatedContact();
    await sendUpdateToFirebase(contactId, updatedContact);
    updateContactInArray(contactId, updatedContact);
    await loadContactsFromFirebase();
    let glanceWindow = document.getElementById('cnt-glance-contact');
    if (glanceWindow && glanceWindow.style.display !== 'none') {
      showContactInfo(contactId);
    }
    getGroupedContacts();
    closeEditFloater();
  } catch (error) {
    console.error('Fehler:', error);
  }
}

function getUpdatedContact() {
  return {
    name: document.getElementById('addContName').value,
    email: document.getElementById('addContMail').value,
    phone: document.getElementById('addContPhone').value,
  };
}

function updateContactInArray(contactId, updatedContact) {
  contactsArray = contactsArray.map((contact) => (contact.id === contactId ? { id: contactId, ...updatedContact } : contact));
}

function showSuccessMessage() {
  let successFloaterHTML = generateSuccessFloaterHTML();
  let successMessageContainer = document.createElement('div');
  successMessageContainer.id = 'successMessageContainer';
  document.getElementById('cnt-main-div').appendChild(successMessageContainer);
  successMessageContainer.innerHTML = successFloaterHTML;
  animateSuccessMessage(successMessageContainer);
}

async function checkAndAddCurrentUser() {
  let currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser || currentUser.name === 'Guest') return;

  if (!isUserInContacts(currentUser.email)) {
    await addCurrentUserToContacts(currentUser);
  }
}

function isUserInContacts(email) {
  return contactsArray.some((contact) => contact.email === email);
}

async function addCurrentUserToContacts(user) {
  let newContact = {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  };
  let response = await postToFirebase(newContact);
  if (response) {
    contactsArray.push({ id: response.id, ...newContact });
    await loadContactsFromFirebase();
    getGroupedContacts();
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1200) {
    document.getElementById('cnt-main-div').style.display = 'none';
    document.getElementById('cnt-list-div').classList.remove('hidden');
    document.getElementById('cnt-list-div').style.display = 'flex';
  }
})
