function isCntNameValid(name) {
  return name.includes(' ');
}

function isCntEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isCntPhoneValid(phone) {
  return /^\+?\d{7,15}$/.test(phone);
}

function isNameValid() {
  let name = document.getElementById('registNewName').value.trim();
  if (name === "") return false;
  const parts = name.split(/\s+/);
  return parts.length >= 2;
}

function isEmailValid() {
  let email = document.getElementById('registNewEmail').value.trim();
  if (email === "") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isPasswordFieldValid() {
  let password = document.getElementById('registNewPassword').value.trim();
  return password.length >= 8;
}

function confirmPasswords() {
  let password = document.getElementById('registNewPassword').value.trim();
  let confirmPassword = document.getElementById('registConfirmPassword').value.trim();
  return password === confirmPassword;
}

function validateForm(event) {
  event.preventDefault();
  let { name, email, phone } = getFormValues();
  if (!isFormValid(name, email, phone)) {
    return false;
  }
  createNewContact(name, email, phone);
  return false;
}

function isFormValid(name, email, phone) {
  if (!name || !email || !phone) return showValidationError('Alle Felder müssen ausgefüllt sein.');
  if (!isCntNameValid(name)) return showValidationError('Bitte Vor- und Nachnamen eingeben.');
  if (!isCntEmailValid(email)) return showValidationError('Bitte gültige E-Mail-Adresse eingeben.');
  if (!isCntPhoneValid(phone)) return showValidationError('Bitte gültige Telefonnummer eingeben.');
  return true;
}