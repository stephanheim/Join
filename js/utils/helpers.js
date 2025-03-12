function isCheckboxChecked(type) {
  if (type === 'signup') {
    return document.getElementById('checkboxSignup').checked;
  }
  if (type === 'remember') {
    return document.getElementById('rememberMe').checked;
  }
}


function toggleRequiredInput(isFocused) {
  let border = document.getElementById('requiredInput');
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}


function toggleRequiredInput(inputElement, isFocused) {
  let border = inputElement.parentElement.parentElement;
  if (border) {
    border.classList.toggle('input-focus', isFocused)
  }
}


function toggleSubmitButton() {
  if (allFieldsValid()) {
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


function openSubMenu() {
  const submenu = document.getElementById('submenu');
  submenu.classList.remove('d-none');
}


function closeSubMenu() {
  let submenu = document.getElementById('submenu');
  if (submenu) {
    submenu.classList.add('d-none');
  }
}


function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInGuest")
  window.location.href = "../index.html";
}



