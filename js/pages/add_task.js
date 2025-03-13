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
  const inputArrow = document.getElementById('standardInput');
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  inputArrow.classList.add('d-none');
  dropDownMenu.innerHTML = assignedToTemplate();
  dropDownMenu.classList.remove('d-none');
}

function closeDropdownMenuAssigned() {
  const inputArrow = document.getElementById('standardInput');
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  inputArrow.classList.remove('d-none');
  dropDownMenu.classList.add('d-none');
}

function openDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const selectedCategory = document.getElementById('selectedCategory');
  let originalCategoryText = 'Select task category';
  const isCategorySelected = false;
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
  if (dropDownMenu.classList.contains('d-none') && !isCategorySelected) {
    selectedCategory.innerText = originalCategoryText;
  }
  dropDownMenu.classList.toggle('d-none');
  dropDownMenu.classList.toggle('drop-down-show');
  dropDownMenu.classList.add('box-shadow');
}

function closeDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  dropDownMenu.classList.add('d-none');
  dropDownMenu.classList.remove('box-shadow');
}

function toggleIcons() {
  const inputField = document.getElementById('addTaskCategory');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  if (inputField.value.trim() !== '') {
    plusIcon.classList.add('d-none');
    otherIcons.classList.remove('d-none');
  } else {
    plusIcon.classList.remove('d-none');
    otherIcons.classList.add('d-none');
  }
}

function clearInput() {
  const inputField = document.getElementById('addTaskCategory');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  inputField.value = '';
  otherIcons.classList.add('d-none');
  plusIcon.classList.remove('d-none');
}

function selectCategory(category) {
  let selectedCategory = document.getElementById('selectedCategory');
  if (selectedCategory) {
    selectedCategory.innerText = category;
    return category;
  }
  closeDropdownMenuCategory();
}

function renderSubtask() {
  let subtaskRef = document.getElementById('addedSubtaks');
  subtaskRef.innerHTML = '';
  for (let i = 0; i < subtaskNotes.length; i++) {
    subtaskRef.innerHTML += subtaskTemplate(i);
  }
}

function addSubtaksFromInput() {
  let subtaskInputRef = document.getElementById('addTaskCategory');
  let subtaskNote = subtaskInputRef.value;
  if (subtaskNote.trim() !== '') {
    subtaskNotes.push(subtaskNote);
    renderSubtask();
  }
  clearInput();
}

function editSubtask(i) {
  let subtaskRef = document.getElementById(`subtask-${i}`);
  subtaskRef.innerHTML = editSubtaskTemplate(i, subtaskNotes[i]);
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
