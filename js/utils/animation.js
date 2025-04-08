// function showAnimateContact() {
//   let overlay = document.getElementById('addContactOverlay');
//   if (overlay.classList === 'slideOut') {
//     overlay.classList.remove('slideOut');
//   } else {
//     overlay.classList.remove('slideOutVertical');
//   }
//   if (window.innerWidth >= 1200) {
//     animateContactDesktop();
//   } else {
//     animateContactMobile()
//   }
// }

function showAnimateContact() {
  let overlay = document.getElementById('addContactOverlay');
  overlay.classList.remove('slideOut', 'slideOutVertical');
  if (window.innerWidth >= 1200) {
    animateContactDesktop();
  } else {
    animateContactMobile()
  }
}

function animateContactDesktop() {
  let addContact = document.getElementById('addContactOverlay');
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = 'hidden';
  addContact.classList.remove('d-none');
  addContact.classList.add('slideIn');
  setTimeout(() => {
    addContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 100);
}

function animateContactMobile() {
  let addContact = document.getElementById('addContactOverlay');
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = 'hidden';
  addContact.classList.remove('d-none');
  addContact.classList.add('slideInVertical');
  setTimeout(() => {
    addContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 100);
}

function animateCloseContactDesktop() {
  let closeFloater = document.getElementById('addContactOverlay');
  closeFloater.classList.remove('slideIn');
  closeFloater.classList.add('slideOut');
  closeFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeFloater.classList.add('d-none');
    closeFloater.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
}

function animateCloseContactMobile() {
  let closeFloater = document.getElementById('addContactOverlay');
  closeFloater.classList.remove('slideInVertical');
  closeFloater.classList.add('slideOutVertical');
  closeFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeFloater.classList.add('d-none');
    closeFloater.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
}

function animateCloseContact() {
  if (window.innerWidth >= 1200) {
    animateCloseContactDesktop();
  } else {
    animateCloseContactMobile();
  }
}

function animateSuccessMessage(successMessageContainer) {
  let successFloater = document.getElementById('successMessage');
  successFloater.classList.remove('cnt-hide');
  successFloater.classList.add('cnt-show');
  setTimeout(() => {
    successFloater.classList.remove('cnt-show');
    successFloater.classList.add('cnt-hide');
    setTimeout(() => {
      successMessageContainer.parentNode.removeChild(successMessageContainer);
    }, 500);
  }, 3000);
}

function messageTaskAdded() {
  let msg = document.getElementById('overlayTaskAdded');
  if (!msg) return;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 1300);
}

const joinLogoMobile = document.querySelector('.start-join-logo img');
if (joinLogoMobile && window.innerWidth <= 600) {
  joinLogoMobile.src = './assets/img/join.svg';
  setTimeout(() => {
    joinLogoMobile.src = './assets/img/join_login.svg';
  }, 800);
}

function showFieldErrors() {
  const messages = document.getElementsByClassName('error-message');
  const requirements = [document.getElementById('addTaskTitle'), document.getElementById('inputDate'), document.getElementById('categoryDropDown')];
  for (const message of messages) {
    message.innerText = 'This field is required';
    message.style.display = 'block';
  }
  for (const required of requirements) {
    required.style.borderColor = '#FF001F';
  }
}

function clearFieldErrors() {
  const messages = document.getElementsByClassName('error-message');
  const requirements = [document.getElementById('addTaskTitle'), document.getElementById('inputDate'), document.getElementById('categoryDropDown')];
  for (const message of messages) {
    message.innerText = '';
    message.style.display = 'none';
  }
  for (const required of requirements) {
    required.style.borderColor = '';
  }
}

function openDropdownCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const arrow = document.getElementById('arrowCategory');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  toggleArrowRotation(arrow, isHidden);
  renderDropdownMenuCategory(dropDownMenu);
  if (isHidden) {
    showDropdown(dropDownMenu);
  } else {
    hideDropdown(dropDownMenu);
  }
}

function selectCategory(category, event) {
  if (event) {
    event.stopPropagation();
  }
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const selectedCategory = document.getElementById('selectedCategory');
  const arrow = document.getElementById('arrowCategory');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  hideDropdown(dropDownMenu);
  toggleArrowRotation(arrow, isHidden);
  if (selectedCategory) {
    selectedCategory.innerText = category;
  }
  selectedCategoryValue = category;
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

function initialsShowOnAssinged(dropDownMenu) {
  const initialCircle = document.getElementById('selectedInitials');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    initialCircle.classList.remove('d-none');
  } else {
    initialCircle.classList.add('d-none');
  }
}

function openBoardCard(id) {
  let { task, subtaskHTML, namesHTML } = taskDataMap[id];
  addSubtask = [...(task.subtasks || '')];
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate(task, subtaskHTML, namesHTML);
  document.body.style.overflow = 'hidden';
  boardCard.classList.remove('slideOut', 'd-none');
  boardCard.classList.add('slideIn');
  setTimeout(() => {
    boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

function closeBoardCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.classList.add('d-none');
    boardCard.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
  selectedPriorityValue = '';
}