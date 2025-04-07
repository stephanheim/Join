function showUserWelcome() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameUser = document.getElementById('welcomeUser');
  let welcomeUser = document.getElementById('welcomeMessage');
  nameUser.innerText = `${userData.name}`;
  welcomeUser.innerText = showDaytimeGreeting();
}

function showDaytimeGreeting() {
  let hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

function getUserInitials() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameParts = userData.name.split(' ');
  let firstInitial = nameParts[0][0].toUpperCase();
  let lastInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : '';
  let initial = firstInitial + lastInitial;
  document.getElementById('userInitial').innerText = initial;
}

function showMoreOptions(contactId) {
  let respCmdContainer = document.getElementById("resp-cmd");
  let editFloaterHTML = generateRespEditFloaterHTML(contactId);
  respCmdContainer.innerHTML += editFloaterHTML;
  let img = document.getElementById("resp-cmd-img");
  if (img) img.classList.add("d-none");
  let floater = document.getElementById("respFloater");
  if (floater) {
    floater.classList.add("preSlideIn");
    setTimeout(() => {
      floater.classList.remove("preSlideIn");
      floater.classList.add("slideIn");
    }, 20);
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 50);
  }
}

function openDropdownAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const arrow = document.getElementById('arrowAssigned');
  updateUIElements(inputField, arrow, dropDownMenu);
  toggleDropdown(dropDownMenu);
  initialsShowOnAssinged(dropDownMenu);
  assignedBorderColor(dropDownMenu);
}

function toggleDropdown(dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  getContacts(dropDownMenu);
  isHidden ? showDropdown(dropDownMenu) : hideDropdown(dropDownMenu);
}

function updateUIElements(inputField, arrow, dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  toggleArrowRotation(arrow, isHidden);
  updatePlaceholder(inputField, isHidden);
}

function renderDropdownUser(dropDownMenu, contacts) {
  contacts = contacts || formattedContactsArray;
  dropDownMenu.innerHTML = '';
  addedContacts(dropDownMenu, contacts);
  applySelectionStyles(contacts);
}

function renderDropdownMenuCategory(dropDownMenu) {
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
}