/**
 * Tracks whether the user has entered a password.
 * Used to control visibility icon state.
 * @type {boolean}
 */
let isPasswordEntered = false;

/**
 * Retrieves and trims the email and password from login input fields.
 *
 * @returns {{email: string, password: string}} Login credentials.
 */
function getLoginInput() {
  let email = document.getElementById('loginEmail').value.trim();
  let password = document.getElementById('loginPassword').value.trim();
  return { email, password };
}

/**
 * Handles the login process:
 * - Validates credentials
 * - Sets session and localStorage
 * - Loads missing tasks
 * - Redirects to dashboard
 */
async function submitLogin() {
  let { email, password } = getLoginInput();
  try {
    let isValid = await isLoginValid(email, password);
    if (!isValid) {
      renderLoginMessage();
      return;
    }
    setLoggedInUserWithWelcome(email);
    setRememberMe();
    await uploadMissingDefaultTasks();
    window.location.href = './pages/dashboard.html';
  } catch (error) {
    console.error('Login failed:', error);
  }
}

/**
 * Sets the logged-in user in localStorage and shows welcome on dashboard.
 *
 * @param {string} email - The email of the logged-in user.
 */
async function setLoggedInUserWithWelcome(email) {
  let user = await findUserFromDB(email);
  localStorage.setItem('loggedInUser', JSON.stringify(user));
  sessionStorage.setItem('showWelcome', 'true');
}

/**
 * Validates login credentials by comparing to Firebase user data.
 *
 * @param {string} email - Entered email.
 * @param {string} password - Entered password.
 * @returns {Promise<boolean>} True if credentials match, false otherwise.
 */
async function isLoginValid(email, password) {
  let user = await findUserFromDB(email);
  return user ? user.password === password : false;
}

/**
 * Fetches all registered users from Firebase and returns the one matching the email.
 *
 * @param {string} email - Email to search for.
 * @returns {Promise<Object|null>} Matching user object or null.
 */
async function findUserFromDB(email) {
  const url = `${BASE_URL}/register/users.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const users = await response.json();
    if (!users) return null;
    return Object.values(users).find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error when retrieving the user data', error);
    return null;
  }
}

/**
 * Updates the password visibility icon and interaction based on input state.
 */
function checkPasswordIcon() {
  let passwordInput = document.getElementById('loginPassword');
  let visibilityIcon = document.getElementById('visibilityLogin');
  isPasswordEntered = passwordInput.value.length > 0;
  if (isPasswordEntered) {
    visibilityIcon.src = './assets/icons/visibility_off.svg';
    visibilityIcon.style.pointerEvents = 'auto';
  } else {
    visibilityIcon.src = './assets/icons/login_pw_lock.svg';
    visibilityIcon.style.pointerEvents = 'none';
  }
}

/**
 * Toggles the visibility of the password input field and updates the icon accordingly.
 */
function togglePasswordVisibility() {
  let passwordInput = document.getElementById('loginPassword');
  let visibilityIcon = document.getElementById('visibilityLogin');
  let isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  visibilityIcon.src = isPasswordVisible
    ? './assets/icons/visibility_off.svg'
    : './assets/icons/visibility.svg';
}

/**
 * Logs in as a guest and redirects directly to the dashboard.
 */
function guestLogin() {
  let guestUser = { name: 'Guest' };
  localStorage.setItem('loggedInUser', JSON.stringify(guestUser));
  sessionStorage.setItem('showWelcome', 'true');
  window.location.href = './pages/dashboard.html';
}

/**
 * Saves or removes login credentials from localStorage based on the "Remember Me" checkbox.
 */
function setRememberMe() {
  let rememberMeCheckbox = isCheckboxChecked('remember');
  let { email, password } = getLoginInput();
  if (rememberMeCheckbox) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('rememberedEmail', email);
    localStorage.setItem('rememberedPassword', password);
  } else {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
  }
}

/**
 * Loads remembered login credentials from localStorage and fills the login form.
 */
function loadRememberMe() {
  let rememberMe = localStorage.getItem('rememberMe') === 'true';
  let email = localStorage.getItem('rememberedEmail') || '';
  let password = localStorage.getItem('rememberedPassword') || '';
  document.getElementById('rememberMe').checked = rememberMe;
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = password;
}

/**
 * If user is remembered, skips login and redirects to dashboard.
 */
function rememberMe() {
  let user = localStorage.getItem('loggedInUser');
  let rememberMe = localStorage.getItem('rememberMe') === 'true';
  if (user && rememberMe) {
    window.location.href = './pages/dashboard.html';
  }
}

/**
 * Logs out the user and redirects to the login page.
 * Clears all user-related data from localStorage.
 */
function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInGuest');
  window.location.href = '../index.html';
}