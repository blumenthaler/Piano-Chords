const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/chords`)
  .then(response => response.json())
  .then(parsedResponse => {
    parsedResponse.data.forEach(function(chordData) {
        createChordsFromJson(chordData)
    })
});

function createChordsFromJson(data) {
    let div = document.createElement('div')
    div.className = "chord"
    let id = data.id
    let name = data.attributes.name
    let structure = data.attributes.structure
    let symbols = data.attributes.symbols
    let chord = new Chord(name, structure, symbols)
    console.log(chord)
} 

class Chord {
    constructor(name, structure, symbols) {
        this.name = name;
        this.structure = structure;
        this.symbols = symbols;
    }
}