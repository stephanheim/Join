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
 * Creates a new contact by sending data to Firebase and processing the response.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email address.
 * @param {string} phone - The contact's phone number.
 */
async function createNewContact(name, email, phone) {
  let newContact = { name, email, phone };
  let response = await postToFirebase(newContact);
  if (!response) return console.error('Error when adding the contact');
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
function getContactinput() {
  return {
    name: document.getElementById('addContName').value.trim(),
    email: document.getElementById('addContMail').value.trim(),
    phone: document.getElementById('addContPhone').value.trim(),
  };
}

/**
 * Checks whether all contact form fields have been filled in (non-empty).
 *
 * @returns {boolean} `true` if all fields are filled, otherwise `false`.
 */
function allContactFieldsAreFilledIn() {
  let { name, email, phone } = getContactinput();
  return name !== "" && email !== "" && phone !== "";
}

/**
 * Handles submission of the contact form with validation and user feedback.
 *
 * @returns {boolean} Always returns false to prevent default form submission.
 */
async function submitAddContact() {
  const { name, email, phone } = getContactinput();
  renderEmptyFieldMessages(name, email, phone);
  if (!allContactFieldsAreFilledIn()) return false;
  try {
    await createNewContact(name, email, phone);
  } catch (error) {
    console.error('Error when adding the contact:', error);
  }
  return false;
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


