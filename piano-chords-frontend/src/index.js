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
        console.log(chordData)
        let chordUserId = chordData.relationships.user.data.id
        let name = chordData.attributes.name
        let structure = chordData.attributes.structure
        let symbols = chordData.attributes.symbols
        let chord = new Chord(name, structure, symbols)   
        // assign user to each chord
            for (const user of usersArray) {
                if (chordUserId == (usersArray.indexOf(user) + 1)) {
                    chord.user(user)
                }
            }
        let selection = document.createElement('option')
        selection.innerText = name;
        selection.className = "chord_select"
        selection.setAttribute('value', name)
        chordsArray.push(chord)
        drop.appendChild(selection)
    })
} 

function createUserFromChord(data) {
    // adds user if they do not already have a chord saved; prevents user duplication
    let user = usersArray.find(user => user.username === data.attributes.username) 
    if (!user) {
        let newUser = new User(data.attributes.username)
        usersArray.push(newUser)
        return newUser
    }    
    else {
        return user
    }
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

function generateChordForm() {
    let container = document.getElementsByClassName("drop_cont")[0]
    let form = document.createElement("form")
    form.className = "new-user-chord-form"
    container.appendChild(form)

    let inputs = []
    let nameInput = document.createElement('input')
    nameInput.setAttribute("name", "name")
    nameInput.setAttribute("placeholder", "Enter Chord Name")
    inputs.push(nameInput)

    let symbolsInput = document.createElement('input')
    symbolsInput.setAttribute('name', 'symbols')
    symbolsInput.setAttribute("placeholder", "Enter Chord Symbol(s) (i.e. for Minor 7: m7, -7)")
    inputs.push(symbolsInput)

    let notesInput = document.createElement('input')
    notesInput.setAttribute('name', 'notes')
    // Be wary: All entered Flats must be converted to enharmonic Sharps (Eb => D#, Bb => A#)
    notesInput.setAttribute('placeholder', 'Enter Note Names (for C Minor 7: C, Eb, G, Bb)')
    inputs.push(notesInput)

    let usernameInput = document.createElement('input')
    usernameInput.setAttribute('name', 'username')
    usernameInput.setAttribute('placeholder', 'Enter your name')
    inputs.push(usernameInput)

    inputs.forEach(input => {
        input.setAttribute("value", "")
        input.setAttribute("class", "chord-input")
        input.setAttribute("type", "text")
        form.appendChild(input)
    })

    let submitChord = document.createElement('input')
    submitChord.setAttribute('type', 'submit')
    submitChord.setAttribute('name', 'submit')
    submitChord.setAttribute('value', 'Submit Chord')
    submitChord.setAttribute('class', 'submit')
    submitChord.setAttribute('id', 'submit')
    submitChord.addEventListener('click', e => {
        e.preventDefault();
        submitNewChord(e.target.form)
    }, false)

    form.appendChild(submitChord)
}

function submitNewChord(form) {
    console.log(form)
    let inputs = form.children
    let chordName = inputs[0].value
    let chordSymbols = inputs[1].value
    let chordNotes = inputs[2].value
    let username = inputs[3].value

    // return fetch(CHORDS_URL, {
    //     method: "POST",
    //     headers: 
    //     {
    //         "Content-Type": "application/json",
    //         Accept: "application/json"
    //     },  
    //     body: JSON.stringify({
    //         "name": chordName,
    //         "symbols": chordSymbols,
    //         "structure": chordNotes,
    //         // user? 
    //     })
    // })
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(object) {
    //     console.log(object);
    // })
    // .catch(function(error) {
    // })
}

function createNewChord() {
    let newChord = document.getElementsByClassName('chord-input')
    console.log(newChord)
}