const BACKEND_URL = 'http://localhost:3000';
const USERS_URL = `${BACKEND_URL}/users`
const CHORDS_URL = `${BACKEND_URL}/chords`
const chordDropdown = document.createElement('div')
chordDropdown.className = "chord"
let dropContainer = document.getElementsByClassName('drop_cont')[0]

const drop = document.createElement('select')
drop.setAttribute('id', 'chord dropdown')
drop.setAttribute('name', 'dropdown')
drop.className = "dropdown_content"
drop.addEventListener('change', () => {
    findChord()
})

let defaultOption = document.createElement('option');
defaultOption.text = 'Select Chord Type';
drop.append(defaultOption);
drop.selectedIndex = 0;
chordDropdown.appendChild(drop)
dropContainer.appendChild(chordDropdown)


fetch(CHORDS_URL)
  .then(response => response.json())
  .then(parsedResponse => {
        createChordsFromJson(parsedResponse)
});

const chordsArray = []
const usersArray = []

function createChordsFromJson(response) {
    let users = response.included
    let chords = response.data
    let chordsUsers = users.map(userData => createUserFromChord(userData))
    chords.forEach(chordData => {
        let chordUserId = chordData.relationships.user.data.id
        let name = chordData.attributes.name
        let structure = chordData.attributes.structure
        let symbols = chordData.attributes.symbols
        let chord = new Chord(name, structure, symbols)   
        // assign user to each chord
            for (const user of usersArray) {
                if (chordUserId == (usersArray.indexOf(user) + 1)) {
                    chord.user(user)
                    console.log(chord)
                }
            }
        let selection = document.createElement('option')
        selection.innerText = name;
        selection.className = "chord_select"
        selection.setAttribute('value', name)
        chordsArray.push(chord)
        drop.appendChild(selection)
    })

    console.log(chordsArray)
} 

function createUserFromChord(data) {
    let user = new User(data.attributes.username)
    usersArray.push(user)
    return user
}

class User {
    constructor(username) {
        this.username = username;
    }
}

class Chord {
    constructor(name, structure, symbols) {
        this.name = name;
        this.structure = structure;
        this.symbols = symbols;
    }

    user(user) {
        this.user = user;
    }
}

function showChords() {
    drop.classList.toggle("show");
}

// function createUserAndChord() {
//     let data  = {"user_id": "1"}
//     fetch(USERS_URL, {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(parsedResponse => {
//         console.log(parsedResponse)
//   });
// }