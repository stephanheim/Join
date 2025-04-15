/**
 * Indicates the current contact form mode: 'add' or 'edit'.
 * 
 * Used to determine which input fields should be validated
 * and which IDs should be targeted in the DOM.
 * 
 * @type {'add' | 'edit'}
 */
let currentContactMode = 'add';

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
 * Checks whether all contact input fields (name, email, phone) are filled in for the given mode.
 *
 * - Trims each field and returns `true` only if none of them are empty.
 * - Uses `mode` to determine whether to check "add" or "edit" input field IDs.
 *
 * @param {'add'|'edit'} [mode='add'] - The form mode to determine which input IDs to use.
 * @returns {boolean} `true` if all fields are filled, otherwise `false`.
 */
function allContactFieldsAreFilledIn(mode) {
  let name = document.getElementById(mode === 'edit' ? 'editContName' : 'addContName').value.trim();
  let email = document.getElementById(mode === 'edit' ? 'editContMail' : 'addContMail').value.trim();
  let phone = document.getElementById(mode === 'edit' ? 'editContPhone' : 'addContPhone').value.trim();
  return name !== "" && email !== "" && phone !== "";
}

/**
 * Validates all input fields in the contact form (add or edit).
 *
 * Returns `true` only if:
 * - all fields are filled in (name, email, phone),
 * - the name contains at least two words,
 * - the email is valid,
 * - the phone number is in correct format.
 *
 * @param {'add'|'edit'} mode - Specifies which contact form variant to validate.
 * @returns {boolean} `true` if all fields are filled and valid, otherwise `false`.
 */
function allContactFieldsValid(mode) {
  return (
    allContactFieldsAreFilledIn(mode) &&
    isContactNameValid(mode) &&
    isContactEmailValid(mode) &&
    isContactPhoneValid(mode)
  );
}

/**
 * Toggles the submit button's enabled state based on form type and validation status.
 *
 * - For `signup` mode, the signup fields must be valid to activate the button.
 * - For `contact` mode, the contact fields (add/edit based on `mode`) must be valid to activate the button.
 * - If validations fail, the corresponding submit button is disabled.
 *
 * @param {'add'|'edit'} [mode] - Optional. Used only if `currentFormMode` is `'contact'`, to check the correct contact form variant.
 */
function toggleSubmitButton(mode) {
  if (currentFormMode === 'signup' && allSignupFieldsValid()) {
    activateButton();
  } else if (currentFormMode === 'contact' && allContactFieldsValid(mode)) {
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
 * Validates the contact name input field for the given mode.
 *
 * - A valid name must not be empty and must contain at least two parts (e.g., first and last name).
 * - Uses the `mode` to determine whether to check the "add" or "edit" input field.
 *
 * @param {'add'|'edit'} [mode='add'] - The form mode to determine which input ID to use.
 * @returns {boolean} `true` if the name is valid, otherwise `false`.
 */
function isContactNameValid(mode = 'add') {
  let id = mode === 'edit' ? 'editContName' : 'addContName';
  let name = document.getElementById(id).value.trim();
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
 * Validates the contact email input field for the given mode.
 *
 * - A valid email must not be empty and must match a standard email format.
 * - Uses the `mode` to determine whether to check the "add" or "edit" input field.
 *
 * @param {'add'|'edit'} [mode='add'] - The form mode to determine which input ID to use.
 * @returns {boolean} `true` if the email is valid, otherwise `false`.
 */
function isContactEmailValid(mode = 'add') {
  let id = mode === 'edit' ? 'editContMail' : 'addContMail';
  let email = document.getElementById(id).value.trim();
  if (email === "") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validates the contact phone input field for the given mode.
 *
 * - A valid phone number must not be empty and must match the pattern: optional '+' followed by 7 to 15 digits.
 * - Uses the `mode` to determine whether to check the "add" or "edit" input field.
 *
 * @param {'add'|'edit'} [mode='add'] - The form mode to determine which input ID to use.
 * @returns {boolean} `true` if the phone number is valid, otherwise `false`.
 */
function isContactPhoneValid(mode = 'add') {
  let id = mode === 'edit' ? 'editContPhone' : 'addContPhone';
  let phone = document.getElementById(id).value.trim();
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

