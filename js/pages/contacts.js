/**
 * Stores all available contacts loaded from Firebase.
 * Each contact is expected to have the following structure:
 * @type {Array<Object>}
 */
let contactsArray = [];

/**
 * Predefined color palette used to assign background colors to contacts.
 * Useful for distinguishing contact badges or initials visually.
 * @type {string[]}
 */
const contactColors = ['#ff7a01', '#9327ff', '#6e52ff', '#fc71ff', '#ffbb2c', '#20d7c2', '#462f8a', '#ff4646'];


/**
 * Initializes the contact view and logic.
 * - Ensures current user is included in the contact list.
 * - Groups contacts alphabetically or by criteria.
 * - Sets up UI animation for the contact overlay.
 */
function initContacts() {
  checkAndAddCurrentUser();
  getGroupedContacts();
  onclickShowAnimateContact();
}

/**
 * Loads all contacts from Firebase and populates the `contactsArray`.
 * Handles errors and delegates detail extraction to `getDetailInfo`.
 *
 * @returns {Promise<void>}
 */
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

/**
 * Fetches all contact data from Firebase as raw JSON.
 *
 * @returns {Promise<Object>} The parsed JSON response from Firebase.
 */
async function getAllContacts() {
  let response = await fetch(`${BASE_URL}.json`);
  return await response.json();
}

/**
 * Extracts and pushes individual contact details into `contactsArray`.
 *
 * @param {Object} contacts - Object containing all contacts keyed by user ID.
 * @returns {Promise<void>}
 */
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

/**
 * Sorts the global contacts array alphabetically by name
 * and returns the grouped result by first letter.
 *
 * @returns {Array<{group: string, contacts: Object[]}>} Alphabetically grouped contacts.
 */
function sortContacts() {
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  return groupContactsByLetter();
}

/**
 * Groups the global contacts array by the first letter of each contact's name.
 * Assumes contacts are already sorted alphabetically.
 *
 * @returns {Array<{group: string, contacts: Object[]}>} Grouped contact objects.
 */
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

/**
 * Extracts initials from a full name (first and last name).
 *
 * @param {string} name - Full name string (e.g. "John Doe").
 * @returns {string} The initials in uppercase (e.g. "JD").
 */
function getInitials(name) {
  let nameParts = name.split(' ');
  return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
}

/**
 * Assigns a color from the predefined contactColors array to each contact,
 * cycling through the color list as needed.
 *
 * @param {Array<{group: string, contacts: Object[]}>} groupedContacts - Grouped contacts to colorize.
 */
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

/**
 * Sorts, groups and prepares contacts for display.
 * Assigns colors and renders them into the DOM.
 */
function getGroupedContacts() {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderContacts(groupedContacts);
}

/**
 * Renders grouped contacts into the contact list container.
 * Each group gets a heading and its contacts rendered with initials.
 *
 * @param {Array<{group: string, contacts: Object[]}>} groupedContacts - Alphabetically grouped contact objects.
 */
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

/**
 * Creates a new contact, posts it to Firebase and handles UI updates.
 *
 * @param {string} name - Contact's full name.
 * @param {string} email - Contact's email address.
 * @param {string} phone - Contact's phone number.
 * @returns {Promise<void>}
 */
async function createNewContact(name, email, phone) {
  let newContact = { name, email, phone };
  let response = await postToFirebase(newContact);
  if (!response) return console.error('Fehler beim Hinzufügen des Kontakts');
  await processNewContact(response.id);
}

/**
 * Reloads contacts after adding a new one and shows it in the UI.
 *
 * @param {string} contactId - The Firebase ID of the newly created contact.
 * @returns {Promise<void>}
 */
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

/**
 * Scrolls to a contact element in the list and centers it in the viewport.
 *
 * @param {string} contactId - The ID of the contact to scroll to.
 */
function scrollToContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  if (contactElement) {
    contactElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Retrieves trimmed values from the contact form input fields.
 *
 * @returns {{name: string, email: string, phone: string}} Form values.
 */
function getFormValues() {
  return {
    name: document.getElementById('addContName').value.trim(),
    email: document.getElementById('addContMail').value.trim(),
    phone: document.getElementById('addContPhone').value.trim(),
  };
}

/**
 * Displays contact information in the UI if the contact exists.
 * Highlights and renders both glance and responsive views.
 *
 * @param {string} contactId - The ID of the contact to show.
 */
function showContactInfo(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  clearHighlightContact();
  highlightContact(contactId);
  showGlanceWindow(contact);
  showResponsiveLayout(contactId);
}

/**
 * Deletes a contact from Firebase and updates the local UI and contact list.
 * Also updates assigned tasks and removes the contact from `contactsArray`.
 *
 * @param {string} contactId - The ID of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(contactId) {
  try {
    await fetch(`${BASE_URL}/contacts/${contactId}.json`, { method: 'DELETE' });
    contactsArray = contactsArray.filter((contact) => contact.id !== contactId);
    closeEditFloater();
    document.getElementById('cnt-glance-contact').style.display = 'none';
    await loadContactsFromFirebase();
    getGroupedContacts();
    await updateAssignedContactsDB(contactId);
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
  return contacts.filter((contact) => contact.id !== deletedId);
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

/**
 * Updates a contact in Firebase and in the local contact array.
 * Refreshes the UI and shows updated info if visible.
 *
 * @param {string} contactId - The ID of the contact to update.
 * @returns {Promise<void>}
 */
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

/**
 * Gets updated contact data from the form inputs.
 *
 * @returns {{name: string, email: string, phone: string}} The updated contact object.
 */
function getUpdatedContact() {
  return {
    name: document.getElementById('addContName').value,
    email: document.getElementById('addContMail').value,
    phone: document.getElementById('addContPhone').value,
  };
}

/**
 * Updates a contact inside the `contactsArray` by matching its ID.
 *
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContact - The updated contact data.
 */
function updateContactInArray(contactId, updatedContact) {
  contactsArray = contactsArray.map((contact) =>
    contact.id === contactId ? { id: contactId, ...updatedContact } : contact
  );
}

/**
 * Checks if the currently logged-in user is in the contact list.
 * If not, adds them as a contact.
 *
 * @returns {Promise<void>}
 */
async function checkAndAddCurrentUser() {
  let currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser || currentUser.name === 'Guest') return;
  if (!isUserInContacts(currentUser.email)) {
    await addCurrentUserToContacts(currentUser);
  }
}

/**
 * Checks whether a user with the given email is already in the contact list.
 *
 * @param {string} email - The email to check for.
 * @returns {boolean} True if the contact exists, false otherwise.
 */
function isUserInContacts(email) {
  return contactsArray.some((contact) => contact.email === email);
}

/**
 * Adds the currently logged-in user to the contact list and updates the UI.
 *
 * @param {{name: string, email: string, phone?: string}} user - The user to add as a contact.
 * @returns {Promise<void>}
 */
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

/**
 * Handles layout changes of the contacts view depending on window width.
 * Shows or hides main/list containers based on screen size.
 */
window.addEventListener('resize', () => {
  const mainDiv = document.getElementById('cnt-main-div');
  const listDiv = document.getElementById('cnt-list-div');
  if (window.innerWidth >= 1200) {
    if (mainDiv) mainDiv.style.display = 'flex';
    if (listDiv) {
      listDiv.classList.remove('hidden', 'd-none');
      listDiv.style.display = 'flex';
    }
  }
  if (window.innerWidth < 1200) {
    if (mainDiv) mainDiv.style.display = 'none';
  }
});


