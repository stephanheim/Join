/**
 * Displays the detailed view for the selected contact.
 *
 * If the contact is already active and the viewport is desktop-sized (≥1200px),
 * the function avoids redundant UI updates.
 *
 * Otherwise, it updates the active contact, highlights it, and shows the details.
 *
 * @param {string} contactId - The ID of the contact to display.
 */
function showContactInfo(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  let isMobile = window.innerWidth < 1200;
  if (activeContactId === contactId && !isMobile) {
    handleContactClick(contact, contactId);
    return;
  }
  activeContactId = contactId;
  handleContactClick(contact, contactId);
}

/**
 * Handles UI updates for a selected contact.
 * Highlights the contact, displays the glance view and adapts layout responsively.
 *
 * @param {Object} contact - The contact object to display.
 * @param {string} contactId - The ID of the contact to highlight and manage.
 */
function handleContactClick(contact, contactId){
  clearHighlightContact();
  highlightContact(contactId);
  showGlanceWindow(contact);
  showResponsiveLayout(contactId);
}