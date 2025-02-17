const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsArray = [];

// Kontakte ab Firebase holen, rendern, sortieren, Farben zuordnen

async function loadContactsFromFirebase() {
    try {
        let contactsResponse = await getAllContacts();
        contactsArray = [];
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
    for (let i = 0; i < userIds.length; i++) { 
        let contactId = userIds[i];
        let contact = contacts[contactId];
        
        contactsArray.push({
            id: contactId,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        });
    }
}

function sortContacts() {
    contactsArray.sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
    let groupedByLetter = [];
    let letterGroup = null;
    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray [i];
        let firstLetter = contact.name[0].toUpperCase();
    if (letterGroup !== firstLetter) {
        letterGroup = firstLetter;
        groupedByLetter.push({
            group: letterGroup,
            contacts: []
        })
    }
    groupedByLetter[groupedByLetter.length - 1].contacts.push(contact);
}
return groupedByLetter;
}


// Neuen Kontakt erstellen, auf Firebase schreiben 

async function createNewContact() {
    let newContact = addContactInput();
    let response = await postToFirebase(newContact);
    if (response) {
        console.log("contact successfully added:", newContact);
        await loadContactsFromFirebase();
        document.getElementById("contactForm").reset();
    } else {
        console.error("Error when adding contact");
    }
}

function validateForm() {
    let form = document.getElementById("contactForm");
    if (!form.checkValidity()) {
        return false; 
    }
    createNewContact();
        return false;
}

async function postToFirebase(contact) {
    try {
        let response = await fetch(BASE_URL + "/contacts.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });
        if (response.ok) {
            let data = await response.json();
            return { id: data.name, ...contact };
        }
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

