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
    let id = data.id
    console.log(id)
} 