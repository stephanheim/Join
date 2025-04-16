/**
 * Filters and renders contacts matching the search term or all contacts if input is too short.
 *
 * @param {string} searchTerm - The string to filter contacts by name.
 */
function searchContacts(searchTerm) {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  if (searchTerm.length < 2) {
    renderDropdownUser(dropDownMenu, formattedContactsArray);
    return;
  }
  let searchContacts = formattedContactsArray.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm.toLowerCase()));
  renderDropdownUser(dropDownMenu, searchContacts);
}

/**
 * Prepares, formats and renders the contact list in the dropdown.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 */
function getContacts(dropDownMenu) {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderDropdownUser(dropDownMenu);
}

/**
 * Toggles the selection of a contact and updates its visual state.
 *
 * @param {Event} event - The event triggered by the user interaction.
 * @param {number} index - The index of the contact in the formattedContactsArray.
 */
function toggleContactsSelection(event, index) {
  const checkbox = document.getElementById(`checkbox-${index}`);
  const container = document.getElementById(`innerDropmenu-${index}`);
  const isCheckbox = event.target === checkbox;
  const checked = isCheckbox ? checkbox.checked : !checkbox.checked;
  if (!checkbox || !container) return;
  if (!isCheckbox) {
    event.preventDefault();
    checkbox.checked = checked;
  }
  updateSelectedContacts(index, checked);
  updateSelectedStyle(container, checked);
}

/**
 * Updates the selectedContacts array based on checkbox state and renders updated initials.
 *
 * @param {number} index - The index of the contact in the formattedContactsArray.
 * @param {boolean} isChecked - Indicates whether the contact is selected (checked) or not.
 */
function updateSelectedContacts(index, isChecked) {
  let contact = formattedContactsArray[index];
  let contactIndex = selectedContacts.findIndex((c) => c.id === contact.id);
  if (isChecked && contactIndex === -1) {
    selectedContacts.push(contact);
  } else if (!isChecked && contactIndex !== -1) {
    selectedContacts.splice(contactIndex, 1);
  }
  renderSelectedInitials();
}