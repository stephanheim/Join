function isCheckboxChecked() {
  return document.getElementById('checkboxSignup').checked;
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