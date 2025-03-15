let subtaskNotes = [];

function initAddTask() {}

function buttonsColorSwitch(btnId) {
  let buttons = document.getElementsByClassName('input-section')[0].getElementsByTagName('button');
  let activeButton = document.getElementById(btnId);
  if (activeButton.classList.contains('isSelected')) {
    activeButton.classList.remove('isSelected');
  } else {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('isSelected');
    }
    activeButton.classList.add('isSelected');
  }
}

function openDropdownMenuAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const isOpen = dropDownMenu.classList.contains('drop-down-show');
  const isClose = dropDownMenu.classList.contains('drop-down-hide');
  renderDropdownContent(dropDownMenu);
  if (isOpen) {
    hideDropdown(dropDownMenu);
  } else {
    showDropdown(dropDownMenu);
  }
  toggleArrowRotatin(isClose);
  updatePlaceholder(inputField, isOpen);
}

function renderDropdownContent(dropDownMenu) {
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = assignedToTemplate();
  }
}

// function renderDropdownContent(dropDownMenu) {
//   if (!dropDownMenu.innerHTML.trim()) {
//     dropDownMenu.innerHTML = formattedContactsArray.map((contact) => assignedToTemplate(contact)).join("");
//   }
// }

function showDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('d-none', 'drop-down-hide');
  dropDownMenu.classList.add('drop-down-show');
}

function hideDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('drop-down-show');
  dropDownMenu.classList.add('drop-down-hide');
  setTimeout(() => {
    dropDownMenu.classList.add('d-none');
  }, 300);
}

function updatePlaceholder(inputField, isClosing) {
  if (inputField) {
    inputField.placeholder = isClosing ? 'Select contacts to assign' : '';
  }
}

function closeDropdownMenuAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  dropDownMenu.classList.remove('d-none');
}

function toggleArrowRotatin(isClose) {
  const arrowImg = document.getElementById('dropdownArrow');
  if (arrowImg) {
    if (isClose) {
      arrowImg.classList.add('rotate-arrow');
    } else {
      arrowImg.classList.remove('rotate-arrow');
    }
  }
}

function openDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
  isCategorySelected();
  dropDownMenu.classList.toggle('d-none');
  dropDownMenu.classList.toggle('drop-down-show');
}

function closeDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  dropDownMenu.classList.add('d-none');
}

function isCategorySelected() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const selectedCategory = document.getElementById('selectedCategory');
  let originalCategoryText = 'Select task category';
  const isCategorySelected = false;
  if (dropDownMenu.classList.contains('d-none') && !isCategorySelected) {
    selectedCategory.innerText = originalCategoryText;
  }
}

function selectCategory(category) {
  let selectedCategory = document.getElementById('selectedCategory');
  if (selectedCategory) {
    selectedCategory.innerText = category;
    return category;
  }
  closeDropdownMenuCategory();
}

function openSubtaskInput() {
  let inputField = document.getElementById('addTaskSubtasks');
  let plusIcon = document.getElementById('plusIcon');
  let otherIcons = document.getElementById('otherIcons');
  let container = document.getElementById('inputContainer');
  container.classList.add('active');
  plusIcon.classList.add('d-none');
  otherIcons.classList.remove('d-none');
  inputField.placeholder = '';
}

function closeSubtaskInput(event) {
  event.stopPropagation();
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  plusIcon.classList.remove('d-none');
  otherIcons.classList.add('d-none');
  inputField.placeholder = 'Add new subtask';
  resetSubtaskInput(event);
}

function renderSubtask() {
  let subtaskRef = document.getElementById('addedSubtaks');
  subtaskRef.innerHTML = '';
  for (let i = 0; i < subtaskNotes.length; i++) {
    subtaskRef.innerHTML += subtaskTemplate(i);
  }
}

function addSubtaksFromInput(event) {
  let subtaskInputRef = document.getElementById('addTaskSubtasks');
  let subtaskNote = subtaskInputRef.value;
  if (subtaskNote.trim() !== '') {
    subtaskNotes.push(subtaskNote);
    renderSubtask();
    resetSubtaskInput(event);
  }
}

function editSubtask(i) {
  let subtaskRef = document.getElementById(`subtask-${i}`);
  if (subtaskRef) {
    subtaskRef.outerHTML = editSubtaskTemplate(i, subtaskNotes[i]);
  }
}

function saveEditedSubtask(i) {
  let inputRef = document.getElementById(`editSubtask-${i}`);
  subtaskNotes[i] = inputRef.value;
  renderSubtask();
}

function resetSubtaskInput(event) {
  event.stopPropagation();
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  let container = document.getElementById('inputContainer');
  inputField.value = '';
  inputField.placeholder = 'Add new subtask';
  plusIcon.classList.remove('d-none');
  container.classList.remove('active');
  if (otherIcons) {
    otherIcons.classList.add('d-none');
  }
}

function deleteSubtask(i) {
  subtaskNotes.splice(i, 1);
  renderSubtask();
}

function formatDate(input) {
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';
  if (value.length > 4) {
    formattedValue = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
  } else if (value.length > 2) {
    formattedValue = value.substring(0, 2) + '/' + value.substring(2);
  } else {
    formattedValue = value;
  }
  input.value = formattedValue;
  return;
}
