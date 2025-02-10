const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";


async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    activateButton()
  }
}


function checkForm() {
  let isValid = comparePassword() && isCheckboxChecked();
  toggleSubmitButton();
  return isValid;
}


function getUserInput() {
  let name = document.getElementById('registNewName');
  let email = document.getElementById('registNewEmail');
  let password = document.getElementById('registNewPassword');
  let confirmPassword = document.getElementById('registConfirmPassword');
  let newUser = ({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value.trim()
  })
  return { newUser, confirmPassword: confirmPassword.value.trim() };
}


function registerNewUser() {
  if (!checkForm()) {
    return false;
  }
  let newUser = getUserInput();
  postUser(newUser);
}


async function postUser(newUser) {
  const url = BASE_URL + "/register/users.json";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  };
  const response = await fetchData(url, options);
  if (response) {
    resetFormRegister();
    registrationComplete();
  }
  return response;
}


function allRequiredFieldsAreFilledIn() {
  let { newUser, confirmPassword } = getUserInput();
  return (
    newUser.name !== "" &&
    newUser.email !== "" &&
    newUser.password !== "" &&
    confirmPassword !== ""
  );
}


function toggleSubmitButton() {
  let filledIn =
    allRequiredFieldsAreFilledIn() &&
    comparePassword() &&
    isCheckboxChecked();
  if (filledIn) {
    activateButton()
  } else {
    deactivateButton()
  }
}


function deactivateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = true;
  return button;
}


function activateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = false;
  return button;
}


function resetFormRegister() {
  const form = document.getElementById('formRegister');
  return form.reset();
}


function registrationComplete() {
  const message = document.getElementById('overlaySuccsessful');
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
    window.location.href = '../index.html';
  }, 1500);
}


function comparePassword() {
  let password = document.getElementById('registNewPassword').value.trim();
  let confirmPassword = document.getElementById('registConfirmPassword').value.trim();
  const message = document.getElementById('compareMessage');
  if (password !== confirmPassword) {
    message.innerText = "Your passwords don't match. Please try again.";
    message.style.display = "block";
    return false;
  }
  message.innerText = "";
  message.style.display = "none";
  return true;
}


function isCheckboxChecked() {
  const checkbox = document.getElementById('checkboxSignup');
  const message = document.getElementById('checkboxMessage');
  if (!checkbox.checked) {
    message.innerText = "Please, check the privacy policy";
    message.style.display = "block";
    return false;
  }
  message.innerText = "";
  message.style.display = "none";
  return true;
}
