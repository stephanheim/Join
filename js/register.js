const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";


async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}


function registerNewUser() {
  let name = document.getElementById('registNewName');
  let email = document.getElementById('registNewEmail');
  let password = document.getElementById('registNewPassword');
  let newUser = ({
    name: name.value,
    email: email.value,
    password: password.value
  })
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
  message.style.display = 'block';
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1500);
}
