const codeNotes = [
    ["C", 3, 81],
    ["C#", 3, 50],
    ["D", 3, 87],
    ["D#", 3, 51],
    ["E", 3, 69],
    ["F", 3, 82],
    ["F#", 3, 53],
    ["G", 3, 84],
    ["G#", 3, 54],
    ["A", 3, 89],
    ["A#", 3, 55],
    ["B", 3, 85],
    ["C", 4, 73],
    ["C#", 4, 57],
    ["D", 4, 79],
    ["D#", 4, 48],
    ["E", 4, 80],
    ["F", 4, 90],
    ["F#", 4, 83],
    ["G", 4, 88],
    ["G#", 4, 68],
    ["A", 4, 67],
    ["A#", 4, 70],
    ["B", 4, 86],
    ["C", 5, 66]
]

let keysPressed = [];
let _audioSynth = new AudioSynth();
let pianoElement = document.getElementById("keyboard");

function uniqueKeyCode(event) {
    let key = event.keyCode || event.which;
    document.getElementById("demo2").innerText = `The event.keycode is: ${key}`
    playPiano(key.toString());
}

function createVisual() {
    let keys = []
    for (i = 0; i < codeNotes.length; i++) {
        let key = document.createElement('div')
        key.setAttribute('id', `${i}_oct_${codeNotes[i][1]}_note_${codeNotes[i][0]}`)
        if (codeNotes[i][0].length === 2) {
            key.setAttribute("class", "key black")
        }
        else {
            key.setAttribute("class", "key white")
        }
        // add event listener for each key
        key.addEventListener("mouseover", function(event) {   
            event.target.style.backgroundColor = "orange";
        })
        key.addEventListener("mouseout", function(event) {
            if (key.className === "key white") {
                event.target.style.backgroundColor = "white";
            }
            else {
                event.target.style.backgroundColor = "black";
            }
        })
        // console.log(key)
        pianoElement.appendChild(key)
        keys.push(key)
    };
    // console.log(keys)
}

function playPiano(keycode) {
    keysPressed.push(keycode);
    console.log(keysPressed);
    _audioSynth.setVolume(0.5);
    let piano = _audioSynth.createInstrument('piano');

    // play note: Name(string), octave(int), duration in seconds(int)
    let note = codeNotes.find(element => element[2] == keycode)
    piano.play(note[0], note[1], 2);
}



createVisual();