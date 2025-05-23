/**
* Returns the HTML template for the "Add Contact" floating form.
* Includes input fields for name, email, and phone with validation and action buttons.
*
* @returns {string} HTML string for the contact creation floater.
*/
function generateFloaterHTML() {
  return `
  <form id="contactForm" class="form-floater" onsubmit="submitAddContact();return false;">
    <div id="contactFloater" class="main-floater">
      <div class="add-contact">
        <img src="../assets/img/join.svg" class="add-icon" />
        <div class="add-text">
          <span class="add-title">Add contact</span>
          <span class="add-subtitle">Tasks are better with a team!</span>
        </div>
        <div class="add-seperator"></div>
        <div onclick="animateCloseContact()" class="add-close-div-white d-none">
          <img src="../assets/icons/close_white.svg" class="add-close-btn-white" />
        </div>
      </div>
      <div class="add-form">
        <div class="add-form-circle">
          <img src="../assets/icons/person-cnt.svg" class="add-icon-pers" />
        </div>
        <div class="right-wrap">
          <div onclick="animateCloseContact()" class="add-close-div-dark">
            <img src="../assets/icons/close.svg" class="add-close-btn-dark" />
          </div>
          <div class="add-fields">
            <div class="input-border">
              <div id="borderNameContact" class="input-div">
                <input onfocus="toggleRequiredInputContact(this, true)"
                  onblur="touchedMessageField = true;toggleRequiredInputContact(this, false);renderContactNameMessage('add')"
                  oninput="toggleSubmitButton()" type="text" placeholder="Name"
                  class="add-input" id="addContName" minlength="2" maxlength="50" aria-label="text" />
                <img src="../assets/icons/person_input.svg" class="input-img" />
              </div>
              <span id="nameMessage" class="error-message"></span>
            </div>
            <div class="input-border">
              <div id="borderEmailContact" class="input-div">
                <input onfocus="toggleRequiredInputContact(this, true)"
                  onblur="touchedMessageField = true;toggleRequiredInputContact(this, false);renderContactEmailMessage('add')"
                  oninput="toggleSubmitButton()" type="text" placeholder="Email"
                  class="add-input" id="addContMail" aria-label="Email" />
                <img src="../assets/icons/mail.svg" class="input-img" />
              </div>
              <span id="emailMessage" class="error-message"></span>
            </div>
            <div class="input-border">
              <div id="borderPhoneContact" class="input-div">
                <input onfocus="toggleRequiredInputContact(this, true)"
                  onblur="touchedMessageField = true;toggleRequiredInputContact(this, false);renderContactPhoneMessage('add')"
                  oninput="toggleSubmitButton()" type="text" placeholder="Phone"
                  class="add-input" aria-label="Phone" id="addContPhone" />
                <img src="../assets/icons/call.svg" class="input-img" />
              </div>
              <span id="phoneMessage" class="error-message"></span>
            </div>
          </div>
          <div class="add-btn-div">
            <button type="button" onclick="animateCloseContact()" class="add-btn-cancel">
              Cancel
              <div class="btn-icons">
                <img src="../assets/icons/close.svg" class="img-btn-close" />
              </div>
            </button>
            <button id="buttonContact" type="submit" class="add-btn-create" disabled>
              Create contact
              <div class="btn-icons">
                <img src="../assets/icons/check.svg" class="img-btn-check" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
  `;
}

/**
* Returns the HTML template for rendering a group label (e.g. alphabet letter) and a separator.
*
* @param {string} group - The group label (usually the first letter of contact names).
* @returns {string} HTML string for the group section.
*/
function generateGroupHTML(group) {
  return `
  <div class="cnt-letter-div">
    <span class="cnt-letter">${group}</span>
  </div>
  <div class="cnt-list-seperator"></div>
  `;
}

/**
* Returns the HTML for a contact entry in the contact list.
*
* @param {Object} contact - The contact object with id, name, email, and color.
* @param {string} initials - The initials to display for the contact.
* @returns {string} HTML string for the contact preview element.
*/
function generateContactsHTML(contact, initials) {
  return `
  <div id="contact-${contact.id}" class="cnt-name" onclick="showContactInfo('${contact.id}')">
    <div class="cnt-initials" style="background-color: ${contact.color}">
      <span>${initials}</span>
    </div>
    <div class="cnt-details">
      <div class="cnt-name-details">
        <span>${contact.name}</span>
      </div>
      <div class="cnt-mail">
        <span>${contact.email}</span>
      </div>
    </div>
  </div>
  `;
}

/**
* Returns the HTML for the detailed contact view, including edit and delete buttons.
*
* @param {Object} contact - The contact object with name, email, phone, color, and id.
* @returns {string} HTML string for the contact detail view.
*/
function generateContactsInfoHTML(contact) {
  return `
  <div class="cnt-glance" onsubmit="submitAddContact()">
    <div class="cnt-glance-details">
      <div class="cnt-glance-initials" style="background-color: ${contact.color}">
        ${getInitials(contact.name)}
      </div>
      <div class="cnt-resp-name">
        ${contact.name}
        <div class="cnt-glance-icon-div">
          <div class="clickable" onclick="addEditContact('${contact.id}')">
            <img src="../assets/icons/edit.svg" /><span>Edit</span>
          </div>
          <div class="cnt-spacer"></div>
          <div class="clickable" onclick="deleteContact('${contact.id}')">
            <img src="../assets/icons/delete.svg" /><span>Delete</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cnt-glance-contact">
      <span class="cnt-contact-info">Contact Information</span>
      <span class="cnt-info-title">Email</span>
      <span class="cnt-info-mail">${contact.email}</span>
      <span class="cnt-info-title">Phone</span>
      <span class="cnt-info-phone">${contact.phone}</span>
    </div>
  </div>
  `;
}

/**
* Returns the HTML template for editing a contact inside the floater.
* Pre-fills the form with the contact's current data and shows save/delete buttons.
*
* @param {Object} contact - The contact object with name, email, phone, color, and id.
* @returns {string} HTML string for the contact edit floater.
*/
function generateContactsEditFloaterHTML(contact) {
  return `
  <form id="contactFormEdit" class="form-floater" onsubmit="updateEditContact('${contact.id}');return false;">
    <div id="contactFloater" class="main-floater">
      <div class="add-contact">
        <img src="../assets/img/join.svg" class="add-icon" />
        <div class="add-text">
          <span class="add-title">Edit contact</span>
        </div>
        <div class="add-seperator"></div>
        <div onclick="animateCloseContact()" class="add-close-div-white d-none">
          <img src="../assets/icons/close_white.svg" class="add-close-btn-white" />
        </div>
      </div>
      <div class="add-form">
        <div class="add-form-circle edit-form-circle" style="background-color: ${contact.color}">
          ${getInitials(contact.name)}
        </div>
        <div class="right-wrap">
          <div onclick="animateCloseContact()" class="add-close-div-dark">
            <img src="../assets/icons/close.svg" class="add-close-btn-dark" />
          </div>
          <div class="add-fields">
            <div class="input-border">
              <div id="borderEditNameContact" class="input-div">
                <input onfocus="toggleRequiredInputContact(this, true)"
                  onblur="touchedMessageField = true;toggleRequiredInputContact(this, false);renderContactNameMessage('edit')"
                  type="text" class="add-input"
                  id="editContName" value="${contact.name}" />
                <img src="../assets/icons/person_input.svg" class="input-img-person" />
              </div>
              <span id="editNameMessage" class="error-message">hier steht was</span>
            </div>
            <div class="input-border">
              <div id="borderEditEmailContact" class="input-div">
                <input onfocus="toggleRequiredInputContact(this, true)"
                  onblur="touchedMessageField = true;toggleRequiredInputContact(this, false);renderContactEmailMessage('edit')"
                  type="text" class="add-input"
                  id="editContMail" value="${contact.email}" />
                <img src="../assets/icons/mail.svg" class="input-img-mail" />
              </div>
              <span id="editEmailMessage" class="error-message">hier steht was</span>
            </div>
            <div class="input-border">
              <div id="borderEditPhoneContact" class="input-div">
                <input onfocus="toggleRequiredInputContact(this, true)"
                  onblur="touchedMessageField = true;toggleRequiredInputContact(this, false);renderContactPhoneMessage('edit')"
                  type="text" class="add-input"
                  id="editContPhone" value="${contact.phone}" />
                <img src="../assets/icons/call.svg" class="input-img-call" />
              </div>
              <span id="editPhoneMessage" class="error-message">hier steht was</span>
            </div>
          </div>
          <div class="add-btn-div">
            <button type="button" onclick="deleteContact('${contact.id}')" class="edit-btn-delete">
              Delete
            </button>
            <button type="submit" class="edit-btn-save">
              Save
              <img src="../assets/icons/check.svg" class="img-btn-check btn-icons" />
          </div>
          </button>
        </div>
      </div>
    </div>
    </div>
  </form>
  `;
}

/**
* Generates the HTML for the success message.
* @returns {string} The HTML string of the success message.
*/
function generateSuccessFloaterHTML() {
  return `
  <div id="successMessage" class="cnt-success-msg cnt-hide">
    Contact successfully created
  </div>
  `;
}

/**
* Returns the HTML for the small action menu shown on responsive view (mobile/tablet).
* Includes edit and delete options for a specific contact.
*
* @param {string} contactId - The ID of the contact to edit or delete.
* @returns {string} HTML string for the responsive edit/delete floater.
*/
function generateRespEditFloaterHTML(contactId) {
  return `
  <div id="respFloater" class="edit-floater slideIn">
    <div class="clickable" onclick="handleEditClick(event, '${contactId}')">
      <img src="../assets/icons/edit.svg" /><span>Edit</span>
    </div>
    <div class="clickable" onclick="handleDeleteClick(event, '${contactId}')">
      <img src="../assets/icons/delete.svg" /><span>Delete</span>
    </div>
  </div>
  `;
}