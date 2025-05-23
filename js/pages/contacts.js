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
 * Stores the ID of the currently selected contact.
 * 
 * Used to prevent reloading the same contact on desktop view.
 * Resets when the contact view is closed or another contact is selected.
 * 
 * @type {string|null}
 */
let activeContactId = null;

/**
 * Initializes the contacts view and logic.
 * 
 * - Loads all contacts from Firebase.
 * - Adds the logged-in user to the contact list if not already present (ignores guest).
 * - Groups and renders the contacts.
 * - Sets up contact overlay animation handlers.
 *
 * @returns {Promise<void>}
 */
async function initContacts() {
  await loadContactsFromFirebase();
  await checkGuestOrUser();
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
    console.error('Error when loading the contacts:', error);
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
    scrollToContact(contactId);
  }, 100);
  showSuccessMessage();
}

/**
 * Retrieves and trims the contact input values from the form.
 *
 * - Depending on the mode, selects the correct input fields for name, email, and phone.
 * - Trims the values to remove leading/trailing whitespace.
 *
 * @param {'add'|'edit'} [mode='add'] - The form mode to determine which input field IDs to use.
 * @returns {{name: string, email: string, phone: string}} - An object containing the trimmed input values.
 */
function getContactinput(mode = 'add') {
  return {
    name: document.getElementById(mode === 'edit' ? 'editContName' : 'addContName').value.trim(),
    email: document.getElementById(mode === 'edit' ? 'editContMail' : 'addContMail').value.trim(),
    phone: document.getElementById(mode === 'edit' ? 'editContPhone' : 'addContPhone').value.trim(),
  };
}

/**
 * Handles submitting the "Add Contact" form.
 *
 * - Validates the input fields using `checkContactForm('add')`.
 * - If valid, extracts the input values and triggers creation of a new contact via `createNewContact()`.
 * - Displays field-specific validation messages if needed.
 * - Logs any errors that occur during the creation process.
 *
 * @returns {Promise<boolean|undefined>} `false` to prevent form submission, or `undefined` if early return.
 */
async function submitAddContact() {
  if (!checkContactForm('add')) return;
  const { name, email, phone } = getContactinput();
  renderEmptyFieldMessages(name, email, phone);
  try {
    await createNewContact(name, email, phone);
  } catch (error) {
    console.error('Error when adding the contact:', error);
  }
  return false;
}

/**
 * Validates the contact form fields based on the given mode.
 *
 * - If mode is `'add'`, it also toggles the submit button based on validation state.
 * - Always checks if all contact fields are valid for the specified mode.
 *
 * @param {'add' | 'edit'} mode - Specifies whether to validate the "add" or "edit" contact form.
 * @returns {boolean} `true` if all fields are valid, otherwise `false`.
 */
function checkContactForm(mode) {
  if (mode === 'add') {
    toggleSubmitButton('add');
  }
  return allContactFieldsValid(mode);
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
    const glance = document.getElementById('cnt-glance-contact');
    if (glance) glance.style.display = 'none';
    await loadContactsFromFirebase();
    getGroupedContacts();
    await updateAssignedContactsDB(contactId);
  } catch (error) {
    console.error('Error when deleting the contact:', error);
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
 * Adds the logged-in user to the contacts list if not already present.
 * 
 * Skips the operation if the user has already been added (tracked via localStorage).
 *
 * @param {{name: string, email: string, phone?: string}} currentUser - The currently logged-in user.
 * @returns {Promise<void>}
 */
async function checkAndAddCurrentUser(currentUser) {
  let userAlreadyAdded = localStorage.getItem('userInContacts');
  if (userAlreadyAdded === 'true') return;
  if (!isUserInContacts(currentUser.email)) {
    await addCurrentUserToContacts(currentUser);
    localStorage.setItem('userInContacts', 'true');
  }
}

/**
 * Checks whether the current user is a guest.
 * If not, ensures the user is added to the contact list.
 *
 * @returns {Promise<void>}
 */
async function checkGuestOrUser() {
  let currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (currentUser && currentUser.name !== 'Guest') {
    await checkAndAddCurrentUser(currentUser);
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


