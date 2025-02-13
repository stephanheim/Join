function standardButtons(btnId) {
  let buttons = document.getElementsByClassName('input-section')[0].getElementsByTagName('button');
  let activeButton = document.getElementById(btnId);
  if (activeButton.classList.contains('isSelected')) {
    activeButton.classList.remove('isSelected');
  } else {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('isSelected');
    }
    activeButton.classList.add('isSelected');
  }
}
