const BACKEND_URL = 'https://piano-chords-api-1.herokuapp.com/';
const USERS_URL = `${BACKEND_URL}/users`
const CHORDS_URL = `${BACKEND_URL}/chords`
const chordDropdown = document.createElement('div')
chordDropdown.className = "chord"
const dropContainer = document.getElementsByClassName('drop_cont')[0]
const headerContainer = document.getElementById("header_cont")
const wrap = document.getElementsByClassName('wrapper')[0]
const chordsArray = []
const usersArray = []

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

    // all(instance) {
    //     return [...instance]
    // }
    
    user(user) {
        this.user = user;
    }
}

wrap.addEventListener('click', function(click) {
    let success = document.getElementById('success')
    let submit = document.getElementById('submit')
    let error = document.getElementById('submit_error')
    if (!!success) {
        success.style.visibility = "hidden"
    }
    if ((click.target !== submit) && (!!error)) {
        error.remove()
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
    if (this.checked) {chordMode = true}
    else {chordMode = false}
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

// upon loading, pre-existing chords from db (if any)
function createChordsFromJson(response) {
    let { data, included } = response
    included.forEach(userData => addUserObjectByName(userData.attributes.username))
    
    // Sorting starts here
    let sorting = data.map(chordData => chordData)
    sorting.sort(function(a, b) {
        let nameA = a.attributes.name.toUpperCase()
        let nameB = b.attributes.name.toUpperCase()
        if (nameA < nameB) {return -1}
        if (nameA > nameB) {return 1}
        return 0
    })
    
    sorting.forEach(chordData => {
        let chordUserId = chordData.relationships.user.data.id
        let { name, structure, symbols } = chordData.attributes
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
    prompt.innerText = "Not seeing a chord you know? Add it Below!"
    container.appendChild(prompt)

    let infoNameLabel = document.createElement('div')
    infoNameLabel.setAttribute('class', 'chord_info')
    infoNameLabel.setAttribute('id', 'info_label_or_name')
    infoNameLabel.innerText = "Play a chord to see its info"
    container.appendChild(infoNameLabel)

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
    if ((!dataName) || (!dataSymbols) || (!chordNotes) || (!chordUsername)) {
        chordSubmitError()
    }
    else {
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
                // sortDropdown()
            })
        }
    }
}

// function sortDropdown() {
//     let options = document.getElementsByClassName("chord_select")
    
//     // console.log(options[0].innerText)
//     let elements = []
//     for (const key of options) {
//         elements.push(key)
//         // key.remove()
//     }
//     elements.sort(function(a, b) {
//         let nameA = a.value.toUpperCase() 
//         let nameB = b.value.toUpperCase()    
//         if (nameA < nameB) {
//             return -1;
//         }
//         if (nameB > nameA) {
//             return 1;
//         }
//         return 0
//     })
//     console.log(elements)
// }

function chordSubmitError() {
    const maybe = document.getElementById('submit_error')
    if (!maybe) {
        let error = document.createElement('h4')
        let message = "Fields cannot be empty. Please try again."
        error.innerText = message
        error.setAttribute('id', 'submit_error')
        let container = document.getElementsByClassName('chord_form_container')[0]
        container.prepend(error)
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
            chordsArray.pop();
            console.log(error)
            return chordSubmitError()
        })
}

function findStructureFromNoteNames(notes) {
    let notesArr = notes.split(", ")
    let newArray = notesArr.map(name => {
        let nonflat = checkNoteNameForFlats(name)
        return checkNoteNameForDoubleSharps(nonflat)
    })
    let notesByName = newArray.map(note => codeNotes.filter(el => el[0] === note))
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
    let structure = actual.map(code => codeNotes.indexOf(codeNotes.find(el => el.join() === code.join())))
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
    let newName = splitName.filter(el => {
        if (!splitNotes.includes(el)) {
            return el
        }
    })
    if (newName.join() === splitName.join()) {
        newName.shift()
    }
    return newName.join(" ")
}

function findChordSymbols(symbols) {
    let splitSymbols = symbols.split(", ")
    let newSymbols = splitSymbols.map(fullSymbol => {
        if (fullSymbol.charAt(1) === "#") {
            let symbol = fullSymbol.split("#")
            symbol.shift()
            return symbol[0]
        }
        else {
            return fullSymbol.slice(1)
        }
    })
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