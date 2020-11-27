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
    parsedResponse.data.forEach(function(chordData) {
        createChordsFromJson(chordData)
    })
});

const chordsArray = []

function createChordsFromJson(data) {
    let name = data.attributes.name
    let structure = data.attributes.structure
    let symbols = data.attributes.symbols
    let chord = new Chord(name, structure, symbols)
    let selection = document.createElement('option')
    selection.innerText = name;
    selection.className = "chord_select"
    selection.setAttribute('value', name)
    chordsArray.push(chord)
    // selection.setAttribute('href', 'link for selection?')
    drop.appendChild(selection)
} 

class Chord {
    constructor(name, structure, symbols) {
        this.name = name;
        this.structure = structure;
        this.symbols = symbols;
    }
}

function showChords() {
    drop.classList.toggle("show");
}

// function createChords() {
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

// createChords()