function standardButtons(btnId) {
  let buttons = document.querySelectorAll('.input-section button');
  let activeButton = document.getElementById(btnId);
  if (activeButton.classList.contains('isSelected')) {
    activeButton.classList.remove('isSelected');
  } else {
    buttons.forEach(function (button) {
      button.classList.remove('isSelected');
    });
    activeButton.classList.add('isSelected');
  }
}
