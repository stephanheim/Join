const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsArray = [];

async function initAll() {
    try {
        let contactsResponse = await getAllContacts();

        if (contactsResponse.register && contactsResponse.register.users) {
            let users = contactsResponse.register.users;
            await getDetailInfo(users);
        }
       
        console.log(contactsArray);  
        // renderContacts(contactsArray);
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte", error);
    }
}

async function getAllContacts() {
    let response = await fetch(`${BASE_URL}.json`);
    return await response.json();
}

async function getDetailInfo(users) {
    let userIds = Object.keys(users);  
    for (let i = 0; i < userIds.length; i++) { 
        let userId = userIds[i];
        let user = users[userId];
        let newUserDetails = user.newUser;
        contactsArray.push({
            name: newUserDetails.name,
            email: newUserDetails.email,
        });
    }
}
