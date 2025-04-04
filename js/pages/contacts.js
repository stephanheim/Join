let contactsArray = [];

const contactColors = ['#ff7a01', '#9327ff', '#6e52ff', '#fc71ff', '#ffbb2c', '#20d7c2', '#462f8a', '#ff4646'];

// Kontakte ab Firebase holen, rendern, sortieren, Farben zuordnen

function initContacts() {
  checkAndAddCurrentUser();
  getGroupedContacts();
}

async function loadContactsFromFirebase() {
  try {
    let contactsResponse = await getAllContacts();
    contactsArray = [];
    if (contactsResponse.contacts) {
      let contacts = contactsResponse.contacts;
      await getDetailInfo(contacts);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Kontakte', error);
  }
}

function getGroupedContacts() {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderContacts(groupedContacts);
}

async function getAllContacts() {
  let response = await fetch(`${BASE_URL}.json`);
  return await response.json();
}

async function getDetailInfo(contacts) {
  let userIds = Object.keys(contacts);
  for (let i = 0; i < userIds.length; i++) {
    let contactId = userIds[i];
    let contact = contacts[contactId];

    contactsArray.push({
      id: contactId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  }
}

function sortContacts() {
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  return groupContactsByLetter();
}

function groupContactsByLetter() {
  let groupedByLetter = [];
  let letterGroup = null;
  contactsArray.forEach((contact) => {
    let firstLetter = contact.name[0].toUpperCase();
    if (letterGroup !== firstLetter) {
      letterGroup = firstLetter;
      groupedByLetter.push({ group: letterGroup, contacts: [] });
    }
    groupedByLetter[groupedByLetter.length - 1].contacts.push(contact);
  });
  return groupedByLetter;
}

function getInitials(name) {
  let nameParts = name.split(' ');
  return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
}

function renderContacts(groupedContacts) {
  let contactList = document.getElementById('contacts-div');
  contactList.innerHTML = '';
  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    contactList.innerHTML += generateGroupHTML(group.group);
    for (let j = 0; j < group.contacts.length; j++) {
      let contact = group.contacts[j];
      let initials = getInitials(contact.name);
      contactList.innerHTML += generateContactsHTML(contact, initials);
    }
  }
}

// Neuen Kontakt erstellen, auf Firebase schreiben

function addNewContact() {
  let addContact = document.getElementById('addContactOverlay');
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = 'hidden';
  addContact.classList.remove('slideOut');
  addContact.classList.add('slideIn');
  addContact.classList.remove('d-none');
  setTimeout(() => {
    addContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

function closeNewContact() {
  let closeFloater = document.getElementById('addContactOverlay');
  closeFloater.classList.remove('slideIn');
  closeFloater.classList.add('slideOut');
  closeFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeFloater.classList.add('d-none');
    closeFloater.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}

async function createNewContact(name, email, phone) {
  let newContact = { name, email, phone };
  let response = await postToFirebase(newContact);
  if (!response) return console.error('Fehler beim Hinzufügen des Kontakts');
  await processNewContact(response.id);
}

async function processNewContact(contactId) {
  await loadContactsFromFirebase();
  getGroupedContacts();
  document.getElementById('contactForm').reset();
  closeNewContact();
  setTimeout(() => {
    highlightContact(contactId);
    showContactInfo(contactId);
    scrollToContact(contactId);
  }, 100);
  showSuccessMessage();
}

function scrollToContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  if (contactElement) {
    contactElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function validateForm(event) {
  event.preventDefault();
  let { name, email, phone } = getFormValues();
  if (!isFormValid(name, email, phone)) {
    return false;
  }
  createNewContact(name, email, phone);
  return false;
}

function getFormValues() {
  return {
    name: document.getElementById('addContName').value.trim(),
    email: document.getElementById('addContMail').value.trim(),
    phone: document.getElementById('addContPhone').value.trim(),
  };
}

function isFormValid(name, email, phone) {
  if (!name || !email || !phone) return showValidationError('Alle Felder müssen ausgefüllt sein.');
  if (!isCntNameValid(name)) return showValidationError('Bitte Vor- und Nachnamen eingeben.');
  if (!isCntEmailValid(email)) return showValidationError('Bitte gültige E-Mail-Adresse eingeben.');
  if (!isCntPhoneValid(phone)) return showValidationError('Bitte gültige Telefonnummer eingeben.');
  return true;
}

function showValidationError(message) {
  alert(message);
  return false;
}

function isCntNameValid(name) {
  return name.includes(' ');
}

function isCntEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isCntPhoneValid(phone) {
  return /^\+?\d{7,15}$/.test(phone);
}


async function postToFirebase(contact) {
  try {
    let response = await fetch(BASE_URL + '/contacts.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (response.ok) {
      let data = await response.json();
      return { id: data.name, ...contact };
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

function showContactInfo(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  clearHighlightContact();
  highlightContact(contactId);
  let glanceWindow = document.getElementById('cnt-glance-contact');
  glanceWindow.style.display = 'none';
  glanceWindow.innerHTML = generateContactsInfoHTML(contact);
  glanceWindow.style.display = 'block';
  if (window.innerWidth < 1200) {
    document.getElementById('cnt-list-div').classList.add('hidden');
    document.getElementById('cnt-main-div').style.display = 'block';
    updateRespCmd(window.innerWidth < 1200, contactId);
  } else {
    document.getElementById('cnt-main-div').style.display = 'block';
  }
    // updateRespCmd(true, contactId);
}

function updateRespCmd(windowWidthOptions, contactId) {
  let respCmdImg = document.getElementById("resp-cmd-img");
  if (windowWidthOptions) {
    respCmdImg.src = "../assets/icons/more-resp-contact.svg";
    respCmdImg.onclick = function () {
      showMoreOptions(contactId);
    };
  } else {
    respCmdImg.src = "../assets/icons/add-contact-mobile.svg";
    respCmdImg.onclick = function () {
      addNewContact();
    };
  }
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
  } 
}




function closeRespEditFloater() {
  let respCmdContainer = document.getElementById("resp-cmd");
  let floater = document.getElementById("respFloater");
  if (floater) {
    floater.classList.remove("slideIn");
    floater.classList.add("slideOut");

    setTimeout(() => {
      floater.remove();
      let img = document.getElementById("resp-cmd-img");
      if (img) img.classList.remove("d-none");
    }, 300); 
  }
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

async function deleteContact(contactId) {
  try {
    await fetch(`${BASE_URL}/contacts/${contactId}.json`, { method: 'DELETE' });
    contactsArray = contactsArray.filter((contact) => contact.id !== contactId);
    closeEditFloater();
    document.getElementById('cnt-glance-contact').style.display = 'none';
    await loadContactsFromFirebase();
    getGroupedContacts();
    await updateAssignedContactsDB(contactId)
  } catch (error) {
    console.error('Fehler beim Löschen des Kontakts:', error);
  }
}

async function updateAssignedContactsDB(){

}

async function updateContact(contactId) {
  try {
    let updatedContact = getUpdatedContact();
    await sendUpdateToFirebase(contactId, updatedContact);
    updateContactInArray(contactId, updatedContact);
    await loadContactsFromFirebase();
    let glanceWindow = document.getElementById('cnt-glance-contact');
    if (glanceWindow && glanceWindow.style.display !== 'none') {
      showContactInfo(contactId);
    }
    getGroupedContacts();
    closeEditFloater();
  } catch (error) {
    console.error('Fehler:', error);
  }
}

function getUpdatedContact() {
  return {
    name: document.getElementById('addContName').value,
    email: document.getElementById('addContMail').value,
    phone: document.getElementById('addContPhone').value,
  };
}

async function sendUpdateToFirebase(contactId, updatedContact) {
  const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedContact),
  });
}

function updateContactInArray(contactId, updatedContact) {
  contactsArray = contactsArray.map((contact) => (contact.id === contactId ? { id: contactId, ...updatedContact } : contact));
}

function addEditContact(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  let editContact = document.getElementById('addContactOverlay');
  editContact.innerHTML = generateContactsEditFloaterHTML(contact);
  document.body.style.overflow = 'hidden';
  editContact.classList.remove('slideOut');
  editContact.classList.add('slideIn');
  editContact.classList.remove('d-none');
  setTimeout(() => {
    editContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

function closeEditFloater() {
  let closeEditFloater = document.getElementById('addContactOverlay');
  closeEditFloater.classList.remove('slideIn');
  closeEditFloater.classList.add('slideOut');
  closeEditFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeEditFloater.classList.add('d-none');
    closeEditFloater.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}

function showSuccessMessage() {
  let successFloaterHTML = generateSuccessFloaterHTML();
  let successMessageContainer = document.createElement('div');
  successMessageContainer.id = 'successMessageContainer';
  document.getElementById('cnt-main-div').appendChild(successMessageContainer);
  successMessageContainer.innerHTML = successFloaterHTML;
  animateSuccessMessage(successMessageContainer);
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

async function checkAndAddCurrentUser() {
  let currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!currentUser || currentUser.name === 'Guest') return;

  if (!isUserInContacts(currentUser.email)) {
    await addCurrentUserToContacts(currentUser);
  }
}

function isUserInContacts(email) {
  return contactsArray.some((contact) => contact.email === email);
}

async function addCurrentUserToContacts(user) {
  let newContact = {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  };
  let response = await postToFirebase(newContact);
  if (response) {
    contactsArray.push({ id: response.id, ...newContact });
    await loadContactsFromFirebase();
    getGroupedContacts();
  }
}

function backToList() {
  document.getElementById("cnt-list-div").classList.remove("hidden");
  document.getElementById('cnt-main-div').style.display = 'none';
  resetRespCmd(false);
}

function resetRespCmd() {
  updateRespCmd(false);
}

