/**
 * Tracks whether the name input field has been interacted with (blurred at least once).
 * 
 * Used to control when validation messages should appear. 
 * Prevents showing errors before the user finishes typing or leaves the field.
 * 
 * @type {boolean}
 */
let touchedMessageField = false;


/**
 * Displays an error message if the email is already registered.
 */
function emailAlreadyRegistered() {
  const message = document.getElementById('emailMessage');
  message.innerText = "This e-mail address is already registered";
  message.style.display = "block";
}

/**
 * Renders a validation message for the name input field on the signup form.
 *
 * - If the input is valid (`isNameValid()` returns true), the message is hidden and the border style is reset.
 * - If the input is invalid and the field has been touched (`touchedMessageField` is true),
 *   an error message is displayed and the input border is highlighted in red.
 *
 * Targets:
 * - The message element with ID `nameMessage`
 * - The input container element with ID `borderName`
 */
function renderNameMessage() {
  const message = document.getElementById('nameMessage');
  const border = document.getElementById('borderName');
  if (isNameValid()) {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
    return;
  }
  if (touchedMessageField) {
    message.innerText = "First and last name are required";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  }
}

/**
 * Renders a validation message for the email input field on the signup form.
 *
 * - If the email input is valid (`isEmailValid()` returns true), the message is hidden and the border is reset.
 * - If the input is invalid and the field has been touched (`touchedMessageField` is true),
 *   an error message is displayed and the input border is highlighted in red.
 *
 * Targets:
 * - The message element with ID `emailMessage`
 * - The input container element with ID `borderEmail`
 */
function renderEmailMessage() {
  const message = document.getElementById('emailMessage');
  const border = document.getElementById('borderEmail');
  if (isEmailValid()) {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
    return;
  }
  if (touchedMessageField) {
    message.innerText = "Email is required";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  }
}

/**
 * Renders a validation message for the password input field on the signup form.
 *
 * - If the password input is valid (`isPasswordFieldValid()` returns true), the message is hidden and the border is reset.
 * - If the input is invalid and the field has been touched (`touchedMessageField` is true),
 *   an error message is displayed and the input border is highlighted in red.
 *
 * Targets:
 * - The message element with ID `passwordMessage`
 * - The input container element with ID `borderPassword`
 */
function renderPasswordMessage() {
  const message = document.getElementById('passwordMessage');
  const border = document.getElementById('borderPassword');
  if (isPasswordFieldValid()) {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
    return;
  }
  if (touchedMessageField) {
    message.innerText = "A password with at least 8 characters is required";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  }
}

/**
 * Renders a validation message for the confirm password input field on the signup form.
 *
 * - If the passwords do not match (`confirmPasswords()` returns false), an error message is shown
 *   and the input border is highlighted in red.
 * - If the passwords match, the message is hidden and the border is reset.
 *
 * Targets:
 * - The message element with ID `comparePasswordMessage`
 * - The input container element with ID `borderConfirm`
 */
function renderComparePasswordMessage() {
  const message = document.getElementById('comparePasswordMessage');
  const border = document.getElementById('borderConfirm');
  if (!confirmPasswords()) {
    message.innerText = "Your passwords don't match";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  } else {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
  }
}

/**
 * Renders a message if the privacy checkbox is not checked.
 *
 * @param {string} type - The ID of the checkbox.
 */
function renderCheckboxMessage(type) {
  const message = document.getElementById('checkboxMessage');
  if (!isCheckboxChecked(type)) {
    message.innerText = "Please, check the privacy policy";
    message.style.display = "block";
  } else {
    message.innerText = "";
    message.style.display = "none";
  }
}

/**
 * Displays a login error message and highlights input fields with a red border.
 */
function renderLoginMessage() {
  const message = document.getElementById('loginMessage');
  const borders = document.getElementsByClassName('outside-input');
  message.innerText = 'Check your email and password. Please try again!';
  message.style.display = 'block';
  for (const border of borders) {
    border.style.borderColor = '#FF001F';
  }
}

/**
 * Shows validation messages for fields that are empty.
 *
 * @param {string} name - Name value.
 * @param {string} email - Email value.
 * @param {string} phone - Phone value.
 */
function renderEmptyFieldMessages(name, email, phone) {
  if (name === "") renderContactNameMessage();
  if (email === "") renderContactEmailMessage();
  if (phone === "") renderContactPhoneMessage();
}

/**
 * Renders a validation message for the add contact name input field.
 *
 * - If the input is valid (`isContactNameValid()` returns true), the message is hidden and the border is reset.
 * - If the input is invalid and the field has been touched (`touchedMessageField` is true),
 *   an error message is shown and the input border is highlighted in red.
 *
 * Targets:
 * - The message element with ID `nameMessage`
 * - The input container element with ID `borderNameContact`
 */
function renderContactNameMessage(mode) {
  const messageId = mode === 'edit' ? 'editNameMessage' : 'nameMessage';
  const borderId = mode === 'edit' ? 'borderEditNameContact' : 'borderNameContact';
  const message = document.getElementById(messageId);
  const border = document.getElementById(borderId);
  if (isContactNameValid(mode)) {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
    return;
  }
  if (touchedMessageField) {
    message.innerText = "First and last name are required";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  }
}

/**
 * Renders a validation message for the add contact email input field.
 *
 * - If the input is valid (`isContactEmailValid()` returns true), the message is hidden and the border is reset.
 * - If the input is invalid and the field has been touched (`touchedMessageField` is true),
 *   an error message is shown and the input border is highlighted in red.
 *
 * Targets:
 * - The message element with ID `emailMessage`
 * - The input container element with ID `borderEmailContact`
 */
function renderContactEmailMessage(mode) {
  const messageId = mode === 'edit' ? 'editEmailMessage' : 'emailMessage';
  const borderId = mode === 'edit' ? 'borderEditEmailContact' : 'borderEmailContact';
  const message = document.getElementById(messageId);
  const border = document.getElementById(borderId);
  if (isContactEmailValid(mode)) {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
    return;
  }
  if (touchedMessageField) {
    message.innerText = "Email is required";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  }
}

/**
 * Renders a validation message for the contact phone input field.
 *
 * - If the input is valid (`isContactPhoneValid()` returns true), the message is hidden and the border is reset.
 * - If the input is invalid and the field has been touched (`touchedMessageField` is true),
 *   an error message is shown and the input border is highlighted in red.
 *
 * Targets:
 * - The message element with ID `phoneMessage`
 * - The input container element with ID `borderPhoneContact`
 */
function renderContactPhoneMessage(mode) {
  const messageId = mode === 'edit' ? 'editPhoneMessage' : 'phoneMessage';
  const borderId = mode === 'edit' ? 'borderEditPhoneContact' : 'borderPhoneContact';
  const message = document.getElementById(messageId);
  const border = document.getElementById(borderId);
  if (isContactPhoneValid(mode)) {
    message.innerText = "";
    message.style.display = "none";
    border.style.borderColor = "";
    return;
  }
  if (touchedMessageField) {
    message.innerText = "Number is required";
    message.style.display = "block";
    border.style.borderColor = "#FF001F";
  }
}