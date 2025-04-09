/**
 * Checks if the provided name contains a space.
 * @param {string} name - The name to validate.
 * @returns {boolean} `true` if the name contains a space, `false` otherwise.
 */
function isCntNameValid(name) {
  return name.includes(" ");
}

/**
 * Validates if the provided email address is in a correct format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} `true` if the email is in a valid format, `false` otherwise.
 */
function isCntEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates if the provided phone number is in a correct format.
 * The format allows an optional plus sign followed by 7 to 15 digits.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} `true` if the phone number is in a valid format, `false` otherwise.
 */
function isCntPhoneValid(phone) {
  return /^\+?\d{7,15}$/.test(phone);
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
 * Validates the form inputs before submitting.
 * Prevents the default form submission if the inputs are invalid, otherwise creates a new contact.
 * @param {Event} event - The form submit event.
 * @returns {boolean} `false` to prevent the default form submission.
 */
function validateForm(event) {
  event.preventDefault();
  let { name, email, phone } = getFormValues();
  if (!isFormValid(name, email, phone)) {
    return false;
  }
  createNewContact(name, email, phone);
  return false;
}

/**
 * Validates the form fields to ensure all required fields are filled and in the correct format.
 * Displays an error message if any field is invalid.
 * @param {string} name - The name entered in the form.
 * @param {string} email - The email entered in the form.
 * @param {string} phone - The phone number entered in the form.
 * @returns {boolean} `true` if all fields are valid, `false` otherwise.
 */
function isFormValid(name, email, phone) {
  if (!name || !email || !phone) return showValidationError("Alle Felder müssen ausgefüllt sein.");
  if (!isCntNameValid(name)) return showValidationError("Bitte Vor- und Nachnamen eingeben.");
  if (!isCntEmailValid(email)) return showValidationError("Bitte gültige E-Mail-Adresse eingeben.");
  if (!isCntPhoneValid(phone)) return showValidationError("Bitte gültige Telefonnummer eingeben.");
  return true;
}

/**
 * Displays a validation error message in an alert box.
 * @param {string} message - The error message to be displayed.
 * @returns {boolean} `false` to indicate a validation failure.
 */
function showValidationError(message) {
  alert(message);
  return false;
}

