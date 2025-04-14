/**
 * Runs all field validations including checkbox and matching passwords.
 *
 * @returns {boolean} True if form is fully valid.
 */
function allSignupFieldsValid() {
  return (
    allSignupFieldsAreFilledIn() &&
    isNameValid() &&
    isEmailValid() &&
    isPasswordFieldValid() &&
    confirmPasswords() &&
    isCheckboxChecked('signup')
  );
}

/**
 * Checks whether all contact form fields have been filled in (non-empty).
 *
 * @returns {boolean} `true` if all fields are filled, otherwise `false`.
 */
function allContactFieldsAreFilledIn() {
  let { name, email, phone } = getContactinput();
  return name !== "" && email !== "" && phone !== "";
}

/**
 * Checks whether all contact form fields are both filled in and valid.
 *
 * @returns {boolean} `true` if all fields are filled and valid, otherwise `false`.
 */
function allContactFieldsValid() {
  return (
    allContactFieldsAreFilledIn() &&
    isContactNameValid() &&
    isContactEmailValid() &&
    isContactPhoneValid()
  );
}

/**
 * Toggles the submit button's enabled state based on the current form mode and its validation status.
 *
 * - If `currentFormMode` is `'signup'` and `allSignupFieldsValid()` returns `true`, the button is enabled.
 * - If `currentFormMode` is `'contact'` and `allContactFieldsValid()` returns `true`, the button is enabled.
 * - Otherwise, the button is disabled.
 *
 * Uses `activateButton()` or `deactivateButton()` depending on validation.
 */
function toggleSubmitButton() {
  if (currentFormMode === 'signup' && allSignupFieldsValid()) {
    activateButton();
  } else if (currentFormMode === 'contact' && allContactFieldsValid()) {
    activateButton();
  } else {
    deactivateButton();
  }
}

/**
 * Validates if the name entered in the registration form is valid.
 * The name is considered valid if it is not empty and contains at least two parts separated by spaces.
 * @returns {boolean} `true` if the name is valid, `false` otherwise.
 */
function isNameValid() {
  let name = document.getElementById("registNewName").value.trim();
  if (name === "") return false;
  const parts = name.split(/\s+/);
  return parts.length >= 2;
}

/**
 * Checks whether the contact name input is valid.
 * 
 * A valid contact name must contain at least two words (e.g. first and last name),
 * separated by whitespace. Leading and trailing spaces are ignored.
 *
 * @returns {boolean} `true` if the contact name is valid, otherwise `false`.
 */
function isContactNameValid() {
  let name = document.getElementById("addContName").value.trim();
  if (name === "") return false;
  const parts = name.split(/\s+/);
  return parts.length >= 2;
}


/**
 * Validates if the email entered in the registration form is in a correct format.
 * The email is considered valid if it is not empty and matches the typical email pattern.
 * @returns {boolean} `true` if the email is valid, `false` otherwise.
 */
function isEmailValid() {
  let email = document.getElementById("registNewEmail").value.trim();
  if (email === "") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Checks whether the contact email input is valid.
 * 
 * A valid email must match the standard email format (e.g. `name@example.com`)
 * and must not be empty. Leading and trailing spaces are ignored.
 *
 * @returns {boolean} `true` if the email is valid, otherwise `false`.
 */
function isContactEmailValid() {
  let email = document.getElementById("addContMail").value.trim();
  if (email === "") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validates whether the contact phone number input is in a correct format.
 * 
 * The accepted format allows an optional plus sign followed by 7 to 15 digits.
 * Leading and trailing spaces are ignored. Empty input is considered invalid.
 *
 * @returns {boolean} `true` if the phone number is in a valid format, otherwise `false`.
 */
function isContactPhoneValid() {
  let phone = document.getElementById("addContPhone").value.trim();
  if (phone === "") return false;
  return /^\+?\d{7,15}$/.test(phone);
}

/**
 * Validates if the password entered in the registration form is at least 8 characters long.
 * @returns {boolean} `true` if the password length is 8 or more characters, `false` otherwise.
 */
function isPasswordFieldValid() {
  let password = document.getElementById("registNewPassword").value.trim();
  return password.length >= 8;
}

/**
 * Compares the password and confirm password fields to ensure they match.
 * @returns {boolean} `true` if the passwords match, `false` otherwise.
 */
function confirmPasswords() {
  let password = document.getElementById("registNewPassword").value.trim();
  let confirmPassword = document.getElementById("registConfirmPassword").value.trim();
  return password === confirmPassword;
}

/**
 * Checks whether a user with the given email is already in the contact list.
 *
 * @param {string} email - The email to check for.
 * @returns {boolean} True if the contact exists, false otherwise.
 */
function isUserInContacts(email) {
  return contactsArray.some((contact) => contact.email === email);
}

