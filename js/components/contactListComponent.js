/**
 * Renders grouped contacts into the contact list container.
 * Each group gets a heading and its contacts rendered with initials.
 *
 * @param {Array<{group: string, contacts: Object[]}>} groupedContacts - Alphabetically grouped contact objects.
 */
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

/**
 * Scrolls to a contact element in the list and centers it in the viewport.
 *
 * @param {string} contactId - The ID of the contact to scroll to.
 */
function scrollToContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  if (contactElement) {
    contactElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}