function generateFloaterHTML() {
  return `
  <form>
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
     <div class="add-close-div">
       <img onclick="closeNewContact()" src="../assets/icons/close.svg" class="add-close-btn" />
    </div>
    <div class="add-fields">
      <div class="input-div">
        <input type="text" placeholder="Name" class="add-input" id="addContName" minlength="2" maxlength="50" required />
        <img src="../assets/icons/person_input.svg" class="input-img-person" />
      </div>
      <div class="input-div">
        <input type="email" placeholder="Email" class="add-input" id="addContMail" required/>
        <img src="../assets/icons/mail.svg" class="input-img-mail" />
      </div>
      <div class="input-div">
        <input type="tel" placeholder="Phone" class="add-input" id="addContPhone" required />
        <img src="../assets/icons/call.svg" class="input-img-call" />
      </div>
    </div>
    <div class="add-btn-div">
      <button class="add-btn-cancel">
        Cancel
        <div class="btn-icons">
          <img src="../assets/icons/close.svg" class="img-btn-close" />
        </div>
      </button>
      <button type="submit" class="add-btn-create" onclick="createNewContact()">
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
