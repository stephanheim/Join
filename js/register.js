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


function registerNewUser() {
  let name = document.getElementById('registNewName');
  let email = document.getElementById('registNewEmail');
  let password = document.getElementById('registNewPassword');
  let newUser = ({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value.trim()
  })
  isFormValid()
  deactivateButton();
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
    clearInputFields();
    registrationComplete();
  }
  return response;
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


function clearInputFields() {
  const form = document.getElementById('formRegister');
  const inputFields = form.getElementsByTagName('input');
  for (let i = 0; i < inputFields.length; i++) {
    const Fields = inputFields[i];
    Fields.value = "";
  }
}


function registrationComplete() {
  const message = document.getElementById('overlaySuccsessful');
  message.classList.remove('d-none');
  setTimeout(() => {
    message.classList.add('d-none');
    window.location.href = '../index.html';
  }, 1500);
}


function confirmPassword() {
  let password = document.getElementById('registNewPassword').value.trim();
  let confirmPassword = document.getElementById('registConfirmPassword').value.trim();
  if (password !== confirmPassword) {
    console.error(`falsch`);
    return false;
  }
  return true;
}


function isCheckboxChecked() {
  const checkbox = document.getElementById('checkboxSignup');
  if (!checkbox.checked) {
    setError(checkbox, "You must accept the Privacy Policy.")
    return false;
  } else {
    setSuccess(checkbox);
    return true;
  }
}

function isFormValid() {
  return (
    confirmPassword() &&
    isCheckboxChecked()
  );
}