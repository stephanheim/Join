/**
 * Displays an error message if the email is already registered.
 */
function emailAlreadyRegistered() {
  const message = document.getElementById('emailMessage');
  message.innerText = "This e-mail address is already registered";
  message.style.display = "block";
}

/**
 * Renders a validation message for the sign up name field.
 */
function renderNameMessage() {
  const message = document.getElementById('nameMessage');
  if (!isNameValid()) {
    message.innerText = "First and last name are required";
    message.style.display = "block";
  } else {
    message.innerText = "";
    message.style.display = "none";
  }
}

/**
 * Renders a validation message for the add contact name field.
 * 
 * If the name is invalid, an error message is shown and the border is highlighted in red.
 * If valid, the message is hidden and the border color is reset.
 */
function renderContactNameMessage() {
  const message = document.getElementById('nameMessage');
  const inputName = document.getElementById('addContName');
  if (!isContactNameValid()) {
    message.innerText = "First and last name are required";
    message.style.display = "block";
    borderColorRed(inputName);
  } else {
    message.innerText = "";
    message.style.display = "none";
    resetBorderColor(inputName);
  }
}

/**
 * Renders a validation message for the sign up email field.
 */
function renderEmailMessage() {
  const message = document.getElementById('emailMessage');
  if (!isEmailValid()) {
    message.innerText = "Email is required";
    message.style.display = "block";
  } else {
    message.innerText = "";
    message.style.display = "none";
  }
}

/**
 * Renders a validation message for the add contact email field.
 * 
 * Displays an error message and highlights the border if the email is invalid.
 * Hides the message and resets the border if the email is valid.
 */
function renderContactEmailMessage() {
  const message = document.getElementById('emailMessage');
  const inputEmail = document.getElementById('addContMail');
  if (!isContactEmailValid()) {
    message.innerText = "Email is required";
    message.style.display = "block";
    borderColorRed(inputEmail);
  } else {
    message.innerText = "";
    message.style.display = "none";
    resetBorderColor(inputEmail);
  }
}

/**
 * Renders a validation message for the contact phone input field.
 * 
 * Displays an error message and highlights the border if the phone number is invalid.
 * Hides the message and resets the border if the phone number is valid.
 */
function renderContactPhoneMessage() {
  const message = document.getElementById('phoneMessage');
  const inputPhone = document.getElementById('addContPhone');
  if (!isContactPhoneValid()) {
    message.innerText = "Number is required";
    message.style.display = "block";
    borderColorRed(inputPhone);
  } else {
    message.innerText = "";
    message.style.display = "none";
    resetBorderColor(inputPhone);
  }
}

/**
 * Renders a validation message for the password field.
 */
function renderPasswordMessage() {
  const message = document.getElementById('passwordMessage');
  if (!isPasswordFieldValid()) {
    message.innerText = "A password with at least 8 characters is required";
    message.style.display = "block";
  } else {
    message.innerText = "";
    message.style.display = "none";
  }
}

/**
 * Renders a message if the password and confirm password do not match.
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