const BACKEND_URL = 'http://localhost:3000';
const chordDropdown = document.createElement('div')
chordDropdown.className = "chord"
let dropContainer = document.getElementsByClassName('drop_cont')[0]
const dropdownBtn = document.createElement('button')
dropdownBtn.setAttribute('onclick', "showChords")
dropdownBtn.className = "drop_btn"
dropdownBtn.innerText = "Select Chord Type"

const drop = document.createElement('div')
drop.setAttribute('id', 'chord dropdown')
drop.className = "dropdown_content"
chordDropdown.appendChild(dropdownBtn)
chordDropdown.appendChild(drop)
dropContainer.appendChild(chordDropdown)



fetch(`${BACKEND_URL}/chords`)
  .then(response => response.json())
  .then(parsedResponse => {
    parsedResponse.data.forEach(function(chordData) {
        createChordsFromJson(chordData)
    })
});

function createChordsFromJson(data) {
    let name = data.attributes.name
    let structure = data.attributes.structure
    let symbols = data.attributes.symbols
    let chord = new Chord(name, structure, symbols)
    let selection = document.createElement('a')
    selection.innerText = name;
    // selection.setAttribute('href', 'link for selection?')
    drop.appendChild(selection)
    console.log(drop)
} 

class Chord {
    constructor(name, structure, symbols) {
        this.name = name;
        this.structure = structure;
        this.symbols = symbols;
    }
}

function showChords() {
    document.getElementById("myDropdown").classList.toggle("show");
}