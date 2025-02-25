function buttonsColorSwitch(btnId) {
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

function openDropdownMenuAssigned() {
  const inputArrow = document.getElementById('standardInput');
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  inputArrow.classList.add('d-none');
  dropDownMenu.innerHTML = assignedToTemplate();
  dropDownMenu.classList.remove('d-none');
}

function closeDropdownMenuAssigned() {
  const inputArrow = document.getElementById('standardInput');
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  inputArrow.classList.remove('d-none');
  dropDownMenu.classList.add('d-none');
}

function openDropdownMenuCategory() {
  const inputArrow = document.getElementById('standardFieldCategory');
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  inputArrow.classList.add('d-none');
  dropDownMenu.innerHTML = categoryTemplate();
  dropDownMenu.classList.remove('d-none');
}

function closeDropdownMenuCategory() {
  const inputArrow = document.getElementById('standardFieldCategory');
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  dropDownMenu.classList.add('d-none');
  inputArrow.classList.remove('d-none');
}
