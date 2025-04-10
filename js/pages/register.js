/**
 * Validates the registration form and toggles submit button accordingly.
 *
 * @returns {boolean} True if all fields are valid.
 */
function checkForm() {
  toggleSubmitButton();
  return allFieldsValid();
}

/**
 * Retrieves and sanitizes the input from the registration form.
 *
 * @returns {{newUser: {name: string, email: string, password: string}, confirmPassword: string}} User data.
 */
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

/**
 * Submits a new user to Firebase if all validations pass and email is available.
 */
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

/**
 * Posts a new user to Firebase and shows registration success if successful.
 *
 * @param {Object} newUser - New user data to register.
 */
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

/**
 * Displays a success message after registration and redirects to login page.
 */
function registrationComplete() {
  const message = document.getElementById('overlaySuccsessful');
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
    window.location.href = '../index.html';
  }, 1500);
}

/**
 * Checks if the provided email is already registered in Firebase.
 *
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if email is available.
 */
async function isThisEmailAvailable(email) {
  const url = BASE_URL + "register/users.json";
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

/**
 * Checks whether all required registration fields are filled in.
 *
 * @returns {boolean} True if all fields have a value.
 */
function allRequiredFieldsAreFilledIn() {
  let { newUser, confirmPassword } = getUserInput();
  return (
    newUser.name !== "" &&
    newUser.email !== "" &&
    newUser.password !== "" &&
    confirmPassword !== ""
  );
}

/**
 * Runs all field validations including checkbox and matching passwords.
 *
 * @returns {boolean} True if form is fully valid.
 */
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

/**
 * Updates the visibility icon state for the password field.
 */
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

/**
 * Updates the visibility icon state for the confirm password field.
 */
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

/**
 * Toggles the visibility of the confirm password input field.
 */
function toggleConfirmVisibility() {
  let passwordInput = document.getElementById('registConfirmPassword');
  let visibilityIcon = document.getElementById('visibilityConfirmSignup');
  let isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  visibilityIcon.src = isPasswordVisible
    ? '../assets/icons/visibility_off.svg'
    : '../assets/icons/visibility.svg';
}