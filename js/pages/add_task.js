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
  const inputArrow = document.getElementById('standardFieldCategory');
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
  dropDownMenu.classList.remove('d-none', 'drop-down-hide');
  requestAnimationFrame(() => {
    dropDownMenu.classList.add('drop-down-show');
  });
}

function closeDropdownMenuCategory() {
  const inputArrow = document.getElementById('standardFieldCategory');
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  dropDownMenu.classList.remove('drop-down-show');
  dropDownMenu.classList.add('drop-down-hide');
  dropDownMenu.classList.add('d-none');
}

function toggleIcons() {
  const inputField = document.getElementById('category');
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
  const inputField = document.getElementById('category');
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
