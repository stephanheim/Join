const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";


async function loadData() {
  let response = await fetch(BASE_URL + '.json');
  let responseToJson = await response.json();
  console.log(responseToJson);
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


async function postUser(newUser = {}, path = "/register/users") {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });
    if (!response.ok) {
      throw new Error(`Server Error:${response.status}`)
    }
    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Error posting user:", error);
  }
}
