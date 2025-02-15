function getLoginInput() {
  let email = document.getElementById('loginEmail').value.trim();
  let password = document.getElementById('loginPassword').value.trim();
  let login = { email, password };
  return login;
}


async function submitLogin() {
  let { email, password } = getLoginInput();
  try {
    let isValid = await isLoginValid(email, password)
    if (!isValid) return;
    let user = await findUserFromDB(email);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "./pages/header_sidebar.html";
  } catch (error) {
    console.error("Login failed:", error);
  }
}


async function isLoginValid(email, password) {
  const url = `${BASE_URL}/register/users.json`;
  try {
    const response = await fetch(url);
    if (!response) throw new Error(`Server Error: ${response.status}`);
    const users = await response.json();
    if (!users) return false;
    let user = Object.values(users).find(user => user.email.toLowerCase() === email.toLowerCase());
    return user && user.password === password;
  } catch (error) {
    console.error("Error during login verification", error);
    return false;
  }
}


async function findUserFromDB(email) {
  const url = `${BASE_URL}/register/users.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const users = await response.json();
    if (!users) return null;
    return Object.values(users).find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error("Error when retrieving the user data", error);
    return null;
  }
}


function guestLogin() {
  let guestUser = { name: "Guest" }
  localStorage.setItem("loggedInUser", JSON.stringify(guestUser));
  window.location.href = "./pages/header_sidebar.html";
}


function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInGuest")
  window.location.href = "../index.html";
}




