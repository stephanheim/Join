/**
 * Renders all available contacts inside the dropdown menu with their current selection status.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 * @param {Array<Object>} contacts - The array of contact objects to render.
 */

function addedContacts(dropDownMenu, contacts, showAll = false) {
  const maxVisible = 5;
  const limit = showAll ? contacts.length : maxVisible;
  const visibleContacts = contacts.slice(0, limit);
  visibleContacts.forEach((contact, i) => {
    const { name, color, initials } = contact;
    const isChecked = selectedContacts.some((c) => c.id === contact.id);
    dropDownMenu.innerHTML += assignedToTemplate(name, color, initials, i, isChecked);
  });
  if (!showAll && contacts.length > maxVisible) {
    const remaining = contacts.length - maxVisible;
    dropDownMenu.innerHTML += moreContactsTemplate(dropDownMenu.id, remaining);
  }
  return visibleContacts;
}

/**
 * Renders all contacts into the given dropdown menu and applies selection styles.
 *
 * @param {string} dropDownMenuId - The ID of the dropdown menu element where contacts will be displayed.
 */
function showAllContacts(dropDownMenuId) {
  const dropDownMenu = document.getElementById(dropDownMenuId);
  dropDownMenu.innerHTML = '';
  const renderedContacts = addedContacts(dropDownMenu, formattedContactsArray, true);
  applySelectionStyles(renderedContacts);
}

/**
 * Applies selection styles to all contacts in the dropdown based on checkbox state.
 *
 * @param {Array<Object>} contacts - Array of contact objects.
 */
function applySelectionStyles(contacts) {
  contacts.forEach((_, i) => {
    updateSelectedStyle(document.getElementById(`innerDropmenu-${i}`), document.getElementById(`checkbox-${i}`)?.checked);
  });
}

/**
 * Updates the visual style of a contact item based on selection state.
 *
 * @param {HTMLElement} element - The container element of the contact item.
 * @param {boolean} isChecked - Whether the contact is selected.
 */
function updateSelectedStyle(element, isChecked) {
  element.classList.toggle('inner-dropmenu', !isChecked);
  element.classList.toggle('inner-dropmenu-checked', isChecked);
}

/**
 * Renders the initials of all selected contacts in the initials display container.
 */
function renderSelectedInitials() {
  const initialsRef = document.getElementById('selectedInitials');
  initialsRef.innerHTML = '';
  for (let i = 0; i < selectedContacts.length; i++) {
    const initials = selectedContacts[i].initials;
    const initialsColor = selectedContacts[i].color;
    initialsRef.innerHTML += initialsTemplate(initials, initialsColor);
  }
}

/**
 * Clears all selected contacts and resets the initials display area.
 */
function resetContactsSelection() {
  let initialContainer = document.getElementById('selectedInitials');
  initialContainer.innerHTML = '';
  selectedContacts.length = 0;
}