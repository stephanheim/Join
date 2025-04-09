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

/**
 * Displays the contact information window and fills it with the specified contact.
 * @param {Object} contact - The contact object with the information.
 */
function showGlanceWindow(contact) {
  let glanceWindow = document.getElementById('cnt-glance-contact');
  glanceWindow.style.display = 'flex';
  glanceWindow.innerHTML = generateContactsInfoHTML(contact);
}

/**
 * Adjusts the layout depending on the window width.
 * @param {number} contactId - The ID of the contact for which the view is opened.
 */
function showResponsiveLayout(contactId) {
  let listDiv = document.getElementById('cnt-list-div');
  let mainDiv = document.getElementById('cnt-main-div');
  if (window.innerWidth < 1200) {
    listDiv.classList.add('hidden');
    listDiv.style.display = 'none';
    mainDiv.style.display = 'flex';
    updateRespCmd(contactId);
  } else {
    listDiv.classList.remove('hidden');
    listDiv.style.display = 'flex';
    mainDiv.style.display = 'flex';
  }
}

function updateRespCmd(contactId) {
  let respCmdImg = document.getElementById("resp-cmd-img");
  windowWidthMobiel = window.innerWidth < 1200;
  respCmdImg.onclick = null;
  if (windowWidthMobiel) {
    respCmdImg.src = "../assets/icons/more-resp-contact.svg";
    onclickShowMoreOptions(contactId);
  } else {
    respCmdImg.src = "../assets/icons/add-contact-mobile.svg";
    onclickShowAnimateContact(contactId);
  }
}

function onclickShowMoreOptions(contactId) {
  let respCmd = document.getElementById("resp-cmd");
  respCmd.onclick = function () {
    showMoreOptions(contactId);
  };
}

function onclickShowAnimateContact(contactId) {
  let respCmd = document.getElementById("resp-cmd");
  respCmd.onclick = function () {
    showAnimateContact(contactId);
  };
}

function backToList() {
  let respCmdImg = document.getElementById("resp-cmd-img");
  if (window.innerWidth >= 1200) {
    document.getElementById('cnt-main-div').style.display = 'none';
    document.getElementById("cnt-list-div").classList.remove("hidden");
    document.getElementById('cnt-list-div').style.display = 'flex';
  } else {
    document.getElementById('cnt-main-div').style.display = 'none';
    document.getElementById('cnt-list-div').classList.remove('hidden');
    document.getElementById('cnt-list-div').style.display = 'flex';
  }
  respCmdImg.src = "../assets/icons/add-contact-mobile.svg";
  onclickShowAnimateContact();
}

function clearHighlightContact() {
  for (let contact of contactsArray) {
    let contactElement = document.getElementById(`contact-${contact.id}`);
    if (contactElement) contactElement.classList.remove('cnt-name-highlight');
  }
}

function highlightContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  contactElement.classList.toggle('cnt-name-highlight');
}