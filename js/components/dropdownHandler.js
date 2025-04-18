/**
 * Adds a delayed click listener to detect clicks outside the assigned dropdown.
 * Prevents immediate closing when opening the dropdown.
 *
 * @param {string} dropdownId - The ID of the dropdown element.
 * @param {string} triggerId - The ID of the input field triggering the dropdown.
 */
function closeOnClickOutsideAssigned(dropdownId, triggerId) {
  setTimeout(() => {
    document.addEventListener('click', (event) => {
      handleClickOutsideAssigned(dropdownId, triggerId, event);
    });
  }, 10);
}

/**
 * Handles click events to detect if the click occurred outside the assigned area.
 * Closes the dropdown if needed.
 *
 * @param {string} dropdownId - The ID of the dropdown element.
 * @param {string} triggerId - The ID of the input field triggering the dropdown.
 * @param {MouseEvent} event - The click event.
 */
function handleClickOutsideAssigned(dropdownId, triggerId, event) {
  const dropDownMenu = document.getElementById(dropdownId);
  const inputField = document.getElementById(triggerId);
  const arrow = document.getElementById('arrowAssigned');
  const container = document.getElementById('assignedInputBorderColor');
  if (!dropDownMenu || !inputField || !arrow || !container) return;
  if (!isDropdownVisible(dropDownMenu)) return;
  if (clickedOutsideAssigned(event, dropDownMenu, inputField, container)) {
    closeAssignedDropdown(inputField, arrow, dropDownMenu);
  }
}

/**
 * Checks if the user clicked outside the dropdown, input, and container.
 *
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} menu - The dropdown element.
 * @param {HTMLElement} input - The input element.
 * @param {HTMLElement} container - The outer container element.
 * @returns {boolean} True if the click was outside the assigned area.
 */
function clickedOutsideAssigned(event, menu, input, container) {
  return !menu.contains(event.target) &&
    !input.contains(event.target) &&
    !container.contains(event.target);
}

/**
 * Closes the assigned dropdown and resets UI states.
 *
 * @param {HTMLElement} input - The input element.
 * @param {HTMLElement} arrow - The arrow icon element.
 * @param {HTMLElement} menu - The dropdown element.
 */
function closeAssignedDropdown(input, arrow, menu) {
  handleAssignedDropdownClose(input, arrow, menu);
  assignedBorderColor(menu);
  initialsShowOnAssinged(menu);
  document.removeEventListener('click', handleClickOutsideAssigned);
}

/**
 * Opens the "Assigned To" dropdown in the task form and updates related UI elements.
 *
 * This includes:
 * - Updating the placeholder and arrow icon via `updateUIElements`
 * - Toggling the dropdown visibility via `toggleDropdown`
 * - Showing or hiding initials using `initialsShowOnAssinged`
 * - Adjusting the border color with `assignedBorderColor`
 */
function openDropdownAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const arrow = document.getElementById('arrowAssigned');
  inputField.focus();
  dropDownMenu.style.scrollbarWidth = 'none';
  updateUIElements(inputField, arrow, dropDownMenu);
  toggleDropdown(dropDownMenu);
  initialsShowOnAssinged(dropDownMenu);
  assignedBorderColor(dropDownMenu);
}

/**
 * Updates the border color of the assigned contacts input field
 * based on the visibility of the dropdown menu.
 *
 * If the dropdown is hidden, a neutral gray border is applied.
 * If the dropdown is visible, a highlight blue border is applied.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to check.
 */
function assignedBorderColor(dropDownMenu) {
  const borderColor = document.getElementById('assignedInputBorderColor');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    borderColor.style.border = '1px solid rgba(209, 209, 209, 1)';
  } else {
    borderColor.style.border = '1px solid rgba(41, 171, 226, 1)';
  }
}

/**
 * Toggles visibility of initials indicator based on dropdown visibility.
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 */
function initialsShowOnAssinged(dropDownMenu) {
  const initialCircle = document.getElementById('selectedInitials');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    initialCircle.classList.remove('d-none');
  } else {
    initialCircle.classList.add('d-none');
  }
}

/**
 * Toggles the visibility of the dropdown menu for assigning contacts.
 *
 * If the dropdown is currently hidden, it fetches the list of contacts,
 * shows the dropdown, and enables the ability to close it by clicking outside.
 * If the dropdown is already visible, it hides the dropdown and sets a
 * placeholder message if no contact was selected.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to toggle.
 */
function toggleDropdown(dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  const inputField = document.getElementById('addTaskAssigned');
  if (isHidden) {
    getContacts(dropDownMenu);
    showDropdown(dropDownMenu);
    closeOnClickOutsideAssigned('dropDownMenuAssigned', 'addTaskAssigned');
  } else {
    hideDropdown(dropDownMenu);
    if (inputField.value.trim() === '') {
      inputField.placeholder = 'Select contacts to assign';
    }
  }
}

/**
 * Displays a dropdown menu by updating its CSS classes.
 *
 * Removes `d-none` and `drop-down-hide`, and adds `drop-down-show` to make the menu visible.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to show.
 */
function showDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('d-none', 'drop-down-hide');
  dropDownMenu.classList.add('drop-down-show');
}

/**
 * Checks if a dropdown element is currently visible.
 *
 * Determines visibility based on the absence of the 'drop-down-hide' CSS class.
 *
 * @param {HTMLElement} dropdownElement - The dropdown element to check.
 * @returns {boolean} True if the dropdown is visible, false otherwise.
 */
function isDropdownVisible(dropdownElement) {
  return !dropdownElement.classList.contains('drop-down-hide');
}

/**
 * Handles the closing behavior of the assigned contacts dropdown.
 *
 * Updates the UI elements (e.g. arrow icon, input field), hides the dropdown menu,
 * and sets a placeholder message if the input field is empty.
 *
 * @param {HTMLElement} inputField - The input field for assigning contacts.
 * @param {HTMLElement} arrow - The arrow icon element related to the dropdown.
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to hide.
 */
function handleAssignedDropdownClose(inputField, arrow, dropDownMenu) {
  updateUIElements(inputField, arrow, dropDownMenu);
  hideDropdown(dropDownMenu);
  if (inputField.value.trim() === '') {
    inputField.placeholder = 'Select contacts to assign';
  }
}

/**
 * Hides a dropdown menu by updating its CSS classes.
 *
 * Removes `drop-down-show` and adds `drop-down-hide` to hide the menu with animation.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to hide.
 */
function hideDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('drop-down-show');
  dropDownMenu.classList.add('drop-down-hide');
}

/**
 * Updates UI elements related to a dropdown's visibility state.
 *
 * - Rotates the dropdown arrow using `toggleArrowRotation`
 * - Updates the input field's placeholder using `updatePlaceholder`
 *
 * The changes depend on whether the dropdown is currently hidden.
 *
 * @param {HTMLInputElement} inputField - The input field associated with the dropdown.
 * @param {HTMLElement} arrow - The arrow icon indicating dropdown state.
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 */
function updateUIElements(inputField, arrow, dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  toggleArrowRotation(arrow, isHidden);
  updatePlaceholder(inputField, isHidden);
}

/**
 * Renders the user dropdown menu with a list of contacts.
 *
 * If no contact list is provided, it falls back to the global `formattedContactsArray`.
 * Clears the existing dropdown content, appends all contact elements via `addedContacts`,
 * and applies selection styles via `applySelectionStyles`.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to render into.
 * @param {Array<Object>} [contacts=formattedContactsArray] - An optional array of contact objects to display.
 */
function renderDropdownUser(dropDownMenu, contacts) {
  contacts = contacts || formattedContactsArray;
  dropDownMenu.innerHTML = '';
  const renderedContacts = addedContacts(dropDownMenu, contacts);
  applySelectionStyles(renderedContacts);
}

/**
 * Renders the category dropdown menu if it hasn't been rendered already.
 *
 * Checks if the dropdown is empty (ignoring whitespace).
 * If empty, it fills the dropdown with content from `categoryTemplate()`.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element for categories.
 */
function renderDropdownMenuCategory(dropDownMenu) {
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
}

/**
 * Toggles the arrow rotation based on dropdown visibility.
 *
 * Adds or removes CSS classes to visually indicate whether the dropdown is open or closed.
 *
 * @param {HTMLElement} arrow - The arrow element to rotate.
 * @param {boolean} isHidden - Whether the dropdown is currently hidden.
 */
function toggleArrowRotation(arrow, isHidden) {
  if (arrow) {
    arrow.classList.toggle('rotate-arrow', isHidden);
    arrow.classList.toggle('rotate-arrow-0', !isHidden);
  }
}

/**
 * Updates the placeholder and value of an input field based on visibility state.
 *
 * If the dropdown is visible (`isHidden` is false), the placeholder is cleared.
 * If the dropdown is hidden (`isHidden` is true), a default placeholder is shown and the value is cleared.
 *
 * @param {HTMLInputElement} inputField - The input field to update.
 * @param {boolean} isHidden - Whether the related dropdown is currently hidden.
 */
function updatePlaceholder(inputField, isHidden) {
  if (inputField) {
    inputField.placeholder = !isHidden ? '' : 'Select contacts to assign';
    inputField.value = isHidden ? '' : inputField.value;
  }
}