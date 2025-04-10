/**
 * Displays an error message if the email is already registered.
 */
function emailAlreadyRegistered() {
  const message = document.getElementById('emailMessage');
  message.innerText = "This e-mail address is already registered";
  message.style.display = "block";
}

/**
 * Renders a validation message for the name field.
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
 * Renders a validation message for the email field.
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