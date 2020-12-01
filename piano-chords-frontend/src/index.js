const BACKEND_URL = 'http://localhost:3000';
const USERS_URL = `${BACKEND_URL}/users`
const CHORDS_URL = `${BACKEND_URL}/chords`
const chordDropdown = document.createElement('div')
chordDropdown.className = "chord"
const dropContainer = document.getElementsByClassName('drop_cont')[0]
const headerContainer = document.getElementById("header_cont")
const wrap = document.getElementsByClassName('wrapper')[0]
wrap.addEventListener('click', function(click) {
    let success = document.getElementById('success')
    if (!!success) {
        success.style.visibility = "hidden"
    }
})

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

const chordModeToggle = document.createElement("input")
chordModeToggle.className = "dropdown_content"
chordModeToggle.setAttribute("type", "checkbox")
chordModeToggle.setAttribute('id', 'chord_mode')
chordModeToggle.addEventListener("change", function() {
    if (this.checked) {
        chordMode = true
    }
    else {
        chordMode = false
    }
})
const chordModeLabel = document.createElement('label')
chordModeLabel.className = "dropdown_content"
chordModeLabel.setAttribute('id', 'chord_mode_label')
chordModeLabel.setAttribute('for', 'chord_mode')
chordModeLabel.innerText = "Select for Chord Mode, Deselect for Keyboard Mode"
dropContainer.appendChild(chordModeToggle)
dropContainer.appendChild(chordModeLabel)


document.addEventListener("DOMContentLoaded", () => {
    // Fetch - Chords Index
  fetch(CHORDS_URL)
  .then(response => response.json())
  .then(parsedResponse => {
        createChordsFromJson(parsedResponse)
});
})

const chordsArray = []
const usersArray = []

// upon loading, pre-existing chords from db (if any)
function createChordsFromJson(response) {
    let users = response.included
    let chords = response.data
    users.forEach(userData => addUserObjectByName(userData.attributes.username))
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
                }
            }
        createChordOptionElement(name)
        chordsArray.push(chord)
    })
} 

function addUserObjectByName(name) {
    let user = usersArray.find(user => user.username === name) 
    if (!user) {
        let newUser = new User(name)
        usersArray.push(newUser)

        return newUser
    }
    else {return user}
}

function createChordOptionElement(name) {
    let selection = document.createElement('option')
    selection.innerText = name;
    selection.className = "chord_select"
    selection.setAttribute('value', name)
    drop.appendChild(selection)
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
    let container = document.getElementsByClassName("chord_form_container")[0]
    let form = document.createElement("form")
    form.className = "new-user-chord-form"
    container.appendChild(form)

    let prompt = document.createElement('div')
    prompt.setAttribute('id', 'form_prompt')
    prompt.innerText = "Not seeing a chord you know? Add it!"
    container.appendChild(prompt)

    let infoLabel = document.createElement('div')
    infoLabel.setAttribute('class', 'chord_info')
    infoLabel.setAttribute('id', 'info_label_or_name')
    infoLabel.innerText = "Play a chord to see its info"
    container.appendChild(infoLabel)

    // let nameInfo = document.createElement('div')
    // nameInfo.setAttribute('class', 'chord_info')
    // nameInfo.setAttribute('id', 'name')
    // nameInfo.innerText = "    "
    // container.appendChild(nameInfo)

    let symbolInfo = document.createElement('div')
    symbolInfo.setAttribute('class', 'chord_info')
    symbolInfo.setAttribute('id', 'symbols')
    symbolInfo.innerText = "    "
    container.appendChild(symbolInfo)

    let notesInfo = document.createElement('div')
    notesInfo.setAttribute('class', 'chord_info')
    notesInfo.setAttribute('id', 'notes')
    notesInfo.innerText = "    "
    container.appendChild(notesInfo)

    let userInfo = document.createElement('div')
    userInfo.setAttribute('class', 'chord_info')
    userInfo.setAttribute('id', 'user')
    userInfo.innerText = "    "
    container.appendChild(userInfo)

    let inputs = []
    let nameInput = document.createElement('input')
    nameInput.setAttribute("name", "name")
    nameInput.setAttribute("placeholder", "Chord Name (i.e. C Minor 7)")
    inputs.push(nameInput)

    let symbolsInput = document.createElement('input')
    symbolsInput.setAttribute('name', 'symbols')
    symbolsInput.setAttribute("placeholder", "Chord Symbol(s) (i.e. Cm7, C-7)")
    inputs.push(symbolsInput)

    let notesInput = document.createElement('input')
    notesInput.setAttribute('name', 'notes')
    // Be wary: All entered Flats must be converted to enharmonic Sharps (Eb => D#, Bb => A#)
    notesInput.setAttribute('placeholder', 'Notes (i.e. C, Eb, G, Bb)')
    inputs.push(notesInput)

    let usernameInput = document.createElement('input')
    usernameInput.setAttribute('name', 'username')
    usernameInput.setAttribute('placeholder', 'Your Name')
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
        submitNewChordAndUser(e.target.form)
    }, false)

    form.appendChild(submitChord)
}

// submits a new chord to db
function submitNewChordAndUser(form) {
    let inputs = form.children
    // Example: "C Major"
    let dataName = inputs[0].value // "C Major"
    let dataSymbols = inputs[1].value // "CM"
    let chordNotes = inputs[2].value // "C, E, G"
    let chordUsername = inputs[3].value // "username"
    // fetch-ready attributes
    let chordStructure = findStructureFromNoteNames(chordNotes)
    let chordName = findChordNameWithoutNote(chordNotes, dataName);
    let chordSymbols = findChordSymbols(dataSymbols)
    let chord = new Chord(chordName, chordStructure, chordSymbols)

    let user = usersArray.find(user => user.username === chordUsername) 
    if (user) {
        chord.user(user)
        chordsArray.push(chord)
        addChord(user, chord)
    }    
    else {
        let data = {
            "username": chordUsername
        }
        return fetch(USERS_URL, {
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },  
                body: JSON.stringify(data)
            })
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            let newUser = new User(object.username);
            usersArray.push(newUser)
            chord.user(newUser)
            chordsArray.push(chord)
            addChord(newUser, chord)
        })
        
    }
}

function addChord(user, chord) {
        let userId = ((usersArray.indexOf(user)) + 1).toString()

        let obj = {
            "name": chord.name,
            "symbols": chord.symbols,
            "structure": chord.structure,
            "user_id": userId
        }
        return fetch(CHORDS_URL, {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json",
                Accept: "application/json"
            },  
            body: JSON.stringify(obj)
            }
        )
        .then(function(response) {
          return response.json();
        })
        .then(function(object) {
            successMessage(object.name)
            return createChordOptionElement(object.name);
        })
        .catch(function(error) {
        })
}

function findStructureFromNoteNames(notes) {
    let notesArr = notes.split(", ")
    let newArray = []
    for (const name of notesArr) {
        let nonflat = checkNoteNameForFlats(name)
        newArray.push(checkNoteNameForDoubleSharps(nonflat))
    }
    let notesByName = []
    newArray.forEach(note => {
        let filtered = codeNotes.filter(el => el[0] === note)
        notesByName.push(filtered)
    })
    let actual = []
    notesByName.forEach(filter => {
        if (notesByName.indexOf(filter) == 0){
            actual.push(filter[0])
        }
        else {
            for (i = 0; i < filter.length; i++) {
                let last = actual[actual.length - 1]
                let codeIndexLast = codeNotes.indexOf(codeNotes.find(el => el.join() === last.join()))
                let index = codeNotes.indexOf(codeNotes.find(el => el.join() === filter[i].join()))
                if (codeIndexLast < index) {
                    actual.push(filter[i])
                    break;
                }
            }
        }
    })
    let structure = []
    actual.forEach(code => structure.push(codeNotes.indexOf(codeNotes.find(el => el.join() === code.join()))))
    let adjust = structure.map(int => int - structure[0])
    return adjust.join(", ")
}

function checkNoteNameForFlats(name) {
    if (name === "Db") {return "C#"}
    else if (name === "Eb") {return "D#"}
    else if (name === "Fb") {return "E"}
    else if (name === "Gb") {return "F#"}
    else if (name === "Ab") {return "G#"}
    else if (name === "Bb") {return "A#"}
    else if (name === "Cb") {return "B"}
    else {return name}
}

function checkNoteNameForDoubleSharps(name) {
    if (name === "C##") {return "D"}
    else if (name === "D##") {return "E"}
    else if (name === "E#") {return "F"}
    else if (name === "E##") {return "F#"}
    else if (name === "F##") {return "G"}
    else if (name === "G##") {return "A"}
    else if (name === "A##") {return "B"}
    else if (name === "B#") {return "C"}
    else if (name === "B##") {return "C#"}
    else {return name}
}

function findChordNameWithoutNote(notes, name) {
    let splitNotes = notes.split(", ") // ["C", "E", "G"]
    let splitName = name.split(" ") // ["C", "Major"]
    let newName = []
    for (const el of splitName) {
        if (!splitNotes.includes(el)) {
            newName.push(el)
        }
    }
    if (newName.join() === splitName.join()) {
        newName.shift()
    }
    return newName.join(" ")
}

function findChordSymbols(symbols) {
    let splitSymbols = symbols.split(", ")
    let newSymbols = []
    for (let symbolArr of splitSymbols) {
        if (symbolArr.charAt(1) === "#") {
            let symbol = symbolArr.split("#")
            symbol.shift()
            newSymbols.push(symbol)
        }
        else {
            let symbol = symbolArr.slice(1)
            newSymbols.push(symbol)
        }
    }
    return newSymbols.join(", ")
}

function successMessage(name) {
    let existing = document.getElementById('success')
    if (existing) {existing.remove()}
    let element = document.createElement('h3')
    element.className = "chord-input"
    element.setAttribute('id', 'success')
    element.innerText = `You added the ${name} chord!`
    let container = document.getElementsByClassName('chord_form_container')[0]
    container.appendChild(element)
}