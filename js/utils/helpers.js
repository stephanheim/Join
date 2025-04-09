function generateUniqueId() {
  return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function isCheckboxChecked(type) {
  if (type === 'signup') {
    return document.getElementById('checkboxSignup').checked;
  }
  if (type === 'remember') {
    return document.getElementById('rememberMe').checked;
  }
}

function toggleArrowRotation(arrow, isHidden) {
  if (arrow) {
    arrow.classList.toggle('rotate-arrow', isHidden);
    arrow.classList.toggle('rotate-arrow-0', !isHidden);
  }
}

function updatePlaceholder(inputField, isHidden) {
  if (inputField) {
    inputField.placeholder = !isHidden ? '' : 'Select contacts to assign';
    inputField.value = isHidden ? '' : inputField.value;
  }
}

function preventFormSubmitOnEnter() {
  let form = document.getElementById('addTaskForm');
  if (!form) {
    return;
  }
  let inputs = form.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && inputs[i].type !== 'submit') {a
        event.preventDefault();
      }
    });
  }
}

function toggleRequiredInput(isFocused) {
  let border = document.getElementById('requiredInput');
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}

function toggleRequiredInput(inputElement, isFocused) {
  let border = inputElement.parentElement.parentElement;
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}

function deactivateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = true;
  return button;
}

function activateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = false;
  return button;
}

function toggleSubmitButton() {
  if (allFieldsValid()) {
    activateButton();
  } else {
    deactivateButton();
  }
}

function resetFormRegister() {
  const form = document.getElementById('formRegister');
  return form.reset();
}

function showSubMenu() {
  const submenu = document.getElementById('submenu');
  submenu.classList.toggle('d-none');
}

function showDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('d-none', 'drop-down-hide');
  dropDownMenu.classList.add('drop-down-show');
}

function hideDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('drop-down-show');
  dropDownMenu.classList.add('drop-down-hide');
}

function getPriorityIcon(priority) {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'urgent-red.svg';
    case 'medium':
      return 'medium-orange.svg';
    case 'low':
      return 'low-green.svg';
    default:
      return 'medium-orange.svg';
  }
}

function getCategoryColor(category) {
  switch (category.toLowerCase()) {
    case 'technical task':
      return '#1FD7C1';
    case 'user story':
      return '#0038FF';
  }
}

function handleOutsideClick(event) {
  const floater = document.getElementById("respFloater");
  if (floater && !floater.contains(event.target)) {
    closeRespEditFloater();
    document.removeEventListener("click", handleOutsideClick);
  }
}

function prepareFormattedContacts() {
  formattedContactsArray = contactsArray.map((contact, index) => ({
    id: contact.id,
    name: contact.name,
    initials: getInitials(contact.name),
    color: contact.color,
  }));
}

function showBoardAfterDelay() {
  setTimeout(() => {
    loadPageContentPath('board');
    setActiveNavBoard();
  }, 1300);
}

function assignedBorderColor(dropDownMenu) {
  const borderColor = document.getElementById('assignedInputBorderColor');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    borderColor.style.border = '1px solid rgba(209, 209, 209, 1)';
  } else {
    borderColor.style.border = '1px solid rgba(41, 171, 226, 1)';
  }
}