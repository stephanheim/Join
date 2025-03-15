let contactsArray = [];
let formattedContactsArray = [];

const contactColors = ["#ff7a01", "#9327ff", "#6e52ff", "#fc71ff", "#ffbb2c", "#20d7c2", "#462f8a", "#ff4646"];

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
    console.error("Fehler beim Laden der Kontakte", error);
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

function assignColorsToContacts(groupedContacts) {
  let colorizeIndex = 0;
  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    for (let j = 0; j < group.contacts.length; j++) {
      group.contacts[j].color = contactColors[colorizeIndex % contactColors.length];
      colorizeIndex++;
    }
  }
}

function prepareFormattedContacts() {
    formattedContactsArray = contactsArray.map((contact) => ({
      ...contact,
      initials: getInitials(contact.name),
    }));
}

function getInitials(name) {
  let nameParts = name.split(" ");
  return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
}

function renderContacts(groupedContacts) {
  let contactList = document.getElementById("contacts-div");
  contactList.innerHTML = "";
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
  let addContact = document.getElementById("addContactOverlay");
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = "hidden";
  addContact.classList.remove("slideOut");
  addContact.classList.add("slideIn");
  addContact.classList.remove("d-none");
  setTimeout(() => {
    addContact.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  }, 200);
}

function closeNewContact() {
  let closeFloater = document.getElementById("addContactOverlay");
  closeFloater.classList.remove("slideIn");
  closeFloater.classList.add("slideOut");
  closeFloater.style.backgroundColor = "rgba(0, 0, 0, 0)";
  setTimeout(() => {
    closeFloater.classList.add("d-none");
    closeFloater.innerHTML = "";
    document.body.style.overflow = "";
  }, 100);
}

async function createNewContact(name, email, phone) {
  let newContact = { name, email, phone };
  let response = await postToFirebase(newContact);
  if (!response) return console.error("Fehler beim Hinzufügen des Kontakts");
  await processNewContact(response.id);
}

async function processNewContact(contactId) {
  await loadContactsFromFirebase();
  getGroupedContacts();
  document.getElementById("contactForm").reset();
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
    contactElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function validateForm() {
  setTimeout(() => {
    let name = document.getElementById("addContName").value.trim();
    let email = document.getElementById("addContMail").value.trim();
    let phone = document.getElementById("addContPhone").value.trim();
    if (!name || !email || !phone) {
      alert("Alle Felder müssen ausgefüllt sein.");
      return false;
    }
    if (!loopValidation(name, email, phone)) {
      return false;
    }
    createNewContact(name, email, phone);
    return false;
  }, 500);
}

function loopValidation(name, email, phone) {
  if (!isCntNameValid(name)) {
    alert("Bitte Vor- und Nachnamen eingeben.");
    return false;
  }
  if (!isCntEmailValid(email)) {
    alert("Bitte gültige E-Mail-Adresse eingeben.");
    return false;
  }
  if (!isCntPhoneValid(phone)) {
    alert("Bitte gültige Telefonnummer eingeben.");
    return false;
  }
  return true;
}

function isCntNameValid(name) {
  return name.includes(" ");
}

function isCntEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isCntPhoneValid(phone) {
  return /^\+?\d{7,15}$/.test(phone);
}

async function postToFirebase(contact) {
  try {
    let response = await fetch(BASE_URL + "/contacts.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    if (response.ok) {
      let data = await response.json();
      return { id: data.name, ...contact };
    }
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

function showContactInfo(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  clearHighlightContact();
  highlightContact(contactId);
  let glanceWindow = document.getElementById("cnt-glance-contact");
  glanceWindow.style.display = "none";
  glanceWindow.innerHTML = generateContactsInfoHTML(contact);
  glanceWindow.style.display = "block";
}

function clearHighlightContact() {
  for (let contact of contactsArray) {
    let contactElement = document.getElementById(`contact-${contact.id}`);
    if (contactElement) contactElement.classList.remove("cnt-name-highlight");
  }
}

function highlightContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  contactElement.classList.toggle("cnt-name-highlight");
}

async function deleteContact(contactId) {
  try {
    await fetch(`${BASE_URL}/contacts/${contactId}.json`, { method: "DELETE" });
    contactsArray = contactsArray.filter((contact) => contact.id !== contactId);
    closeEditFloater();
    document.getElementById("cnt-glance-contact").style.display = "none";
    loadContactsFromFirebase();
    getGroupedContacts();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

async function updateContact(contactId) {
  try {
    let updatedContact = getUpdatedContact();
    await sendUpdateToFirebase(contactId, updatedContact);
    updateContactInArray(contactId, updatedContact);
    await loadContactsFromFirebase();
    let glanceWindow = document.getElementById("cnt-glance-contact");
    if (glanceWindow && glanceWindow.style.display !== "none") {
      showContactInfo(contactId);
    }
    getGroupedContacts();
    closeEditFloater();
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function getUpdatedContact() {
  return {
    name: document.getElementById("addContName").value,
    email: document.getElementById("addContMail").value,
    phone: document.getElementById("addContPhone").value,
  };
}

async function sendUpdateToFirebase(contactId, updatedContact) {
  const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedContact),
  });
}

function updateContactInArray(contactId, updatedContact) {
  contactsArray = contactsArray.map((contact) =>
    contact.id === contactId ? { id: contactId, ...updatedContact } : contact
  );
}

function addEditContact(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  let editContact = document.getElementById("addContactOverlay");
  editContact.innerHTML = generateContactsEditFloaterHTML(contact);
  document.body.style.overflow = "hidden";
  editContact.classList.remove("slideOut");
  editContact.classList.add("slideIn");
  editContact.classList.remove("d-none");
  setTimeout(() => {
    editContact.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  }, 200);
}

function closeEditFloater() {
  let closeEditFloater = document.getElementById("addContactOverlay");
  closeEditFloater.classList.remove("slideIn");
  closeEditFloater.classList.add("slideOut");
  closeEditFloater.style.backgroundColor = "rgba(0, 0, 0, 0)";
  setTimeout(() => {
    closeEditFloater.classList.add("d-none");
    closeEditFloater.innerHTML = "";
    document.body.style.overflow = "";
  }, 100);
}

function showSuccessMessage() {
  let successFloaterHTML = generateSuccessFloaterHTML();
  let successMessageContainer = document.createElement("div");
  successMessageContainer.id = "successMessageContainer";
  document.getElementById("cnt-main-div").appendChild(successMessageContainer);
  successMessageContainer.innerHTML = successFloaterHTML;
  animateSuccessMessage(successMessageContainer);
}

function animateSuccessMessage(successMessageContainer) {
  let successFloater = document.getElementById("successMessage");
  successFloater.classList.remove("cnt-hide");
  successFloater.classList.add("cnt-show");
  setTimeout(() => {
    successFloater.classList.remove("cnt-show");
    successFloater.classList.add("cnt-hide");
    setTimeout(() => {
    successMessageContainer.parentNode.removeChild(successMessageContainer);
    }, 500);
  }, 3000);
}

async function checkAndAddCurrentUser() {
  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!currentUser || currentUser.name === "Guest") return;

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
    phone: user.phone || "",
  };
  let response = await postToFirebase(newContact);
  if (response) {
    contactsArray.push({ id: response.id, ...newContact });
    await loadContactsFromFirebase();
    getGroupedContacts();
  }
}
