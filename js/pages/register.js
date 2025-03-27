function checkForm() {
  toggleSubmitButton();
  return allFieldsValid();
}


function getUserInput() {
  let name = document.getElementById('registNewName');
  let email = document.getElementById('registNewEmail');
  let password = document.getElementById('registNewPassword');
  let confirmPassword = document.getElementById('registConfirmPassword');
  let newUser = {
    name: name.value.trim(),
    email: email.value.trim().toLowerCase(),
    password: password.value.trim()
  };
  return { newUser, confirmPassword: confirmPassword.value.trim() };
}


async function submitNewUser() {
  if (!checkForm()) return;
  let { newUser } = getUserInput();
  try {
    let isAvailable = await isThisEmailAvailable(newUser.email);
    if (!isAvailable) {
      emailAlreadyRegistered();
      return;
    }
    await postUser(newUser);
  } catch (error) {
    console.error("Registration failed:", error);
  }
}


function emailAlreadyRegistered() {
  const message = document.getElementById('emailMessage');
  message.innerText = "This e-mail address is already registered";
  message.style.display = "block";
}


async function postUser(newUser) {
  const url = BASE_URL + "/register/users.json";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  };
  const response = await fetchData(url, options);
  if (!response) return;
  resetFormRegister();
  registrationComplete();
}


function registrationComplete() {
  const message = document.getElementById('overlaySuccsessful');
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
    window.location.href = '../index.html';
  }, 1500);
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


async function isThisEmailAvailable(email) {
  const url = BASE_URL + "/register/users.json";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const users = await response.json();
    if (!users) return true;
    return !Object.values(users).some(user => user.email === email.toLowerCase());
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
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


function allRequiredFieldsAreFilledIn() {
  let { newUser, confirmPassword } = getUserInput();
  return (
    newUser.name !== "" &&
    newUser.email !== "" &&
    newUser.password !== "" &&
    confirmPassword !== ""
  );
}


function allFieldsValid() {
  return (
    allRequiredFieldsAreFilledIn() &&
    isNameValid() &&
    isEmailValid() &&
    isPasswordFieldValid() &&
    confirmPasswords() &&
    isCheckboxChecked('signup')
  );
}


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


function checkPasswordIcon() {
  let passwordInput = document.getElementById('registNewPassword');
  let visibilityIcon = document.getElementById('visibilityPwSignup');
  isPasswordEntered = passwordInput.value.length > 0;
  if (isPasswordEntered) {
    visibilityIcon.src = '../assets/icons/visibility_off.svg';
    visibilityIcon.style.pointerEvents = 'auto';
  } else {
    visibilityIcon.src = '../assets/icons/login_pw_lock.svg';
    visibilityIcon.style.pointerEvents = 'none';
  }
}


function checkConfirmIcon() {
  let passwordInput = document.getElementById('registConfirmPassword');
  let visibilityIcon = document.getElementById('visibilityConfirmSignup');
  isPasswordEntered = passwordInput.value.length > 0;
  if (isPasswordEntered) {
    visibilityIcon.src = '../assets/icons/visibility_off.svg';
    visibilityIcon.style.pointerEvents = 'auto';
  } else {
    visibilityIcon.src = '../assets/icons/login_pw_lock.svg';
    visibilityIcon.style.pointerEvents = 'none';
  }
}


function toggleConfirmVisibility() {
  let passwordInput = document.getElementById('registConfirmPassword');
  let visibilityIcon = document.getElementById('visibilityConfirmSignup');
  let isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  visibilityIcon.src = isPasswordVisible
    ? '../assets/icons/visibility_off.svg'
    : '../assets/icons/visibility.svg'
}