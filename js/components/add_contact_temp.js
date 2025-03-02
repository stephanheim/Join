function generateFloaterHTML() {
  return `
<form id="contactForm" onsubmit="return validateForm();">
<div id="contactFloater" class="main-floater">
<div class="add-contact">
  <img src="../assets/img/join.svg" class="add-icon" />
  <div class="add-text">
    <span class="add-title">Add contact</span>
    <span class="add-subtitle">Tasks are better with a team!</span>
  </div>
  <div class="add-seperator"></div>
</div>
<div class="add-form">
  <div class="add-form-circle">
    <img src="../assets/icons/person-cnt.svg" class="add-icon-pers" />
  </div>
  <div class="right-wrap">
     <div onclick="closeNewContact()" class="add-close-div">
       <img src="../assets/icons/close.svg" class="add-close-btn" />
    </div>
    <div class="add-fields">
      <div class="input-div">
        <input type="text" placeholder="Name" class="add-input" id="addContName" minlength="2" maxlength="50" required />
        <img src="../assets/icons/person_input.svg" class="input-img-person" />
      </div>
      <div class="input-div">
        <input type="email" placeholder="Email" class="add-input" id="addContMail" required pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"/>
        <img src="../assets/icons/mail.svg" class="input-img-mail" />
      </div>
      <div class="input-div">
        <input type="tel" placeholder="Phone" class="add-input" id="addContPhone" required  />
        <img src="../assets/icons/call.svg" class="input-img-call" />
      </div>
    </div>
    <div class="add-btn-div">
      <button onclick="closeNewContact() "class="add-btn-cancel">
        Cancel
        <div class="btn-icons">
          <img src="../assets/icons/close.svg" class="img-btn-close" />
        </div>
      </button>
      <button type="submit" class="add-btn-create">
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

function generateGroupHTML (group) {
  return `
    <div class="cnt-letter-div">
          <span class="cnt-letter">${group}</span>
        </div>
        <div class="cnt-list-seperator"></div>
  `;
}

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

function generateContactsInfoHTML(contact) {
  return `
    <div class="cnt-glance">
      <div class="cnt-glance-details">
        <div class="cnt-glance-initials" style="background-color: ${contact.color}">
          ${getInitials(contact.name)}
        </div>
        <div>
          ${contact.name}
          <div class="cnt-glance-icon-div">
            <img src="../assets/icons/edit.svg" onclick="editContact(${contact.id})"/><span>Edit</span>
            <div class="cnt-spacer"></div>
            <img src="../assets/icons/delete.svg" onclick="deleteContact(${contact.id})"/><span>Delete</span>
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
