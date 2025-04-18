/**
 * Displays a personalized welcome message for the logged-in user.
 *
 * Retrieves the user data from local storage, sets the user's name
 * in the element with ID `welcomeUser`, and displays a dynamic greeting
 * (e.g., "Good morning") in the element with ID `welcomeMessage`.
 *
 * Relies on a `showDaytimeGreeting()` function to determine the greeting text.
 */

function showUserWelcome() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameUser = document.getElementById('welcomeUser');
  let welcomeUser = document.getElementById('welcomeMessage');
  nameUser.innerText = `${userData.name}`;
  welcomeUser.innerText = showDaytimeGreeting();
}

/**
 * Returns a greeting message based on the current time of day.
 *
 * - Morning: 05:00–11:59 → "Good Morning"
 * - Afternoon: 12:00–17:59 → "Good afternoon"
 * - Evening/Night: 18:00–04:59 → "Good evening"
 *
 * @returns {string} - A time-based greeting.
 */
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

/**
 * Extracts the initials from the logged-in user's name and displays them.
 *
 * Retrieves user data from local storage (`loggedInUser`),
 * extracts the first character of the first and (if available) last name,
 * then inserts the initials into the element with ID `userInitial`.
 *
 * Example: "Jane Doe" → "JD", "Alice" → "A"
 */
function getUserInitials() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameParts = userData.name.split(' ');
  let firstInitial = nameParts[0][0].toUpperCase();
  let lastInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : '';
  let initial = firstInitial + lastInitial;
  document.getElementById('userInitial').innerText = initial;
}

/**
 * Displays a responsive edit/delete options floater for a contact.
 *
 * - Appends the floater HTML for the given contact to the container with ID `resp-cmd`.
 * - Hides the image element with ID `resp-cmd-img`.
 * - Adds a delayed click listener (`handleOutsideClick`) to close the floater when clicking outside of it.
 *
 * @param {string} contactId - The ID of the contact for which the options floater is shown.
 */
function showMoreOptions(contactId) {
  let respCmdContainer = document.getElementById('resp-cmd');
  let editFloaterHTML = generateRespEditFloaterHTML(contactId);
  respCmdContainer.innerHTML += editFloaterHTML;
  let img = document.getElementById('resp-cmd-img');
  if (img) img.classList.add('d-none');
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 50);
}

/**
 * Displays the contact information window and fills it with the specified contact.
 * @param {Object} contact - The contact object with the information.
 */

function showGlanceWindow(contact) {
  let glanceWindow = document.getElementById('cnt-glance-contact');
  glanceWindow.innerHTML = generateContactsInfoHTML(contact);
  glanceWindow.style.display = 'flex';
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

/**
 * Updates the responsive command icon (`resp-cmd-img`) and its behavior
 * based on the current window width.
 *
 * - On mobile screens (< 1200px), sets the icon to "more options" and calls `onclickShowMoreOptions`.
 * - On larger screens, sets the icon to "add contact" and calls `onclickShowAnimateContact`.
 *
 * @param {string} contactId - The ID of the contact the action should refer to.
 */
function updateRespCmd(contactId) {
  let respCmdImg = document.getElementById('resp-cmd-img');
  windowWidthMobiel = window.innerWidth < 1200;
  respCmdImg.onclick = null;
  if (windowWidthMobiel) {
    respCmdImg.src = '../assets/icons/more-resp-contact.svg';
    onclickShowMoreOptions(contactId);
  } else {
    respCmdImg.src = '../assets/icons/add-contact-mobile.svg';
    onclickShowAnimateContact(contactId);
  }
}

/**
 * Assigns a click handler to the responsive command container (`resp-cmd`)
 * that shows the "more options" floater for the specified contact.
 *
 * @param {string} contactId - The ID of the contact for which the options should be shown.
 */
function onclickShowMoreOptions(contactId) {
  let respCmd = document.getElementById('resp-cmd');
  respCmd.onclick = function () {
    event.stopPropagation();
    showMoreOptions(contactId);
  };
}

/**
 * Assigns a click handler to the responsive command container (`resp-cmd`)
 * that triggers the animated contact overlay for the specified contact.
 *
 * @param {string} contactId - The ID of the contact to show in the animated overlay.
 */
function onclickShowAnimateContact(contactId) {
  let respCmd = document.getElementById('resp-cmd');
  respCmd.onclick = function () {
    showAnimateContact(contactId);
  };
}

/**
 * Switches the view back to the contact list and updates the responsive command icon.
 *
 * - Hides the main contact content (`cnt-main-div`)
 * - Shows the contact list container (`cnt-list-div`)
 * - Updates the responsive command icon to "add contact"
 * - Re-binds the click handler for opening the contact overlay
 *
 * Behavior is the same for both mobile and desktop view.
 */
function backToList() {
  let respCmdImg = document.getElementById('resp-cmd-img');
  document.getElementById('cnt-main-div').style.display = 'none';
  document.getElementById('cnt-list-div').classList.remove('hidden');
  document.getElementById('cnt-list-div').style.display = 'flex';
  respCmdImg.src = '../assets/icons/add-contact-mobile.svg';
  closeRespEditFloater();
  onclickShowAnimateContact();
}

/**
 * Removes the highlight class (`cnt-name-highlight`) from all contact elements.
 *
 * Iterates through the `contactsArray` and removes the highlight class
 * from each corresponding DOM element if it exists.
 */
function clearHighlightContact() {
  for (let contact of contactsArray) {
    let contactElement = document.getElementById(`contact-${contact.id}`);
    if (contactElement) contactElement.classList.remove('cnt-name-highlight');
  }
}

/**
 * Toggles the highlight class (`cnt-name-highlight`) for a specific contact element.
 *
 * If the contact is currently highlighted, the class will be removed.
 * If not, the class will be added.
 *
 * @param {string} contactId - The ID of the contact to highlight.
 */
function highlightContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  contactElement.classList.add('cnt-name-highlight');
}

/**
 * Toggles the visibility of responsive elements based on window width.
 *
 * - Shows the desktop-specific content (`#requiredDesktop`) when width ≥ 970px.
 * - Shows the mobile-specific content (`#requiredMobil`) when width < 970px.
 * - Called on window resize and initial page load.
 */
function toggleResponsiveRequired() {
  const desktop = document.getElementById('requiredDesktop');
  const mobil = document.getElementById('requiredMobil');
  if (window.innerWidth >= 970) {
    if (desktop) desktop.classList.remove('d-none');
    if (mobil) mobil.classList.add('d-none');
  } else {
    if (mobil) mobil.classList.remove('d-none');
    if (desktop) desktop.classList.add('d-none');
  }
}

function toggleResponsiveFloatingRequired() {
  const desktop = document.getElementById('requiredDesktopFloating');
  const mobil = document.getElementById('requiredMobilFloating');
  if (window.innerWidth >= 971) {
    if (desktop) desktop.classList.remove('d-none');
    if (mobil) mobil.classList.add('d-none');
  } else {
    if (mobil) mobil.classList.remove('d-none');
    if (desktop) desktop.classList.add('d-none');
  }
}

window.addEventListener('resize', toggleResponsiveRequired);
window.addEventListener('load', toggleResponsiveRequired);
window.addEventListener('resize', toggleResponsiveFloatingRequired);
window.addEventListener('load', toggleResponsiveFloatingRequired);
