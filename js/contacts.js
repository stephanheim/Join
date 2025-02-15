const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsArray = [];


async function createNewContact() {
    let newContact = addContactInput();
    let response = await postToFirebase(newContact);
    if (response) {
        console.log("contact successfully added:", newContact);
    } else {
        console.error("Error when adding contact");
    }
}

async function postToFirebase(contact) {
try {
    let response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    });
    return response.ok ? contact : null;
} catch (error) {
    console.error("Network error:", error);
    return null;
}
}


function addContactInput() {
    let name = document.getElementById('addContName').value;
    let email = document.getElementById('addContMail').value;
    let phone = document.getElementById('addContPhone').value;
    let newContact = { name, email, phone };
    return newContact;
}



async function initAll() {
    try {
        let contactsResponse = await getAllContacts();

        if (contactsResponse.contacts) {
            let contacts = contactsResponse.contacts;
            await getDetailInfo(contacts);
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

async function getDetailInfo(contacts) {
    let userIds = Object.keys(contacts);  
    for (let i = 0; i < contacts.length; i++) { 
        let contactId = contactIds[i];
        let contact = contacts[contactId];
        
        contactsArray.push({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        });
    }
}
