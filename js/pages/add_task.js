function initAddTask() { }

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
  let originalCategoryText = "Select task category";
  const isCategorySelected = false;
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
  if (dropDownMenu.classList.contains('d-none') && !isCategorySelected) {
    selectedCategory.innerText = originalCategoryText;
  }
  dropDownMenu.classList.toggle('d-none');
  dropDownMenu.classList.toggle('drop-down-show');
}

function closeDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
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
