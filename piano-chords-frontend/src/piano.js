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
    let code = event.keyCode || event.which;
    let keyEls = event.target.children[2].children[0].children
    let find = codeNotes.find(element => element[2] === code)
    let element = findKeyElementFromCodeNotes(find, keyEls);
    element.style.backgroundColor = "orange";
    setTimeout(function() {
        if (element.className === "key white") {
            element.style.backgroundColor = "white";
        }
        else {
            element.style.backgroundColor = "black";
        }
    }, 1000)
    document.getElementById("demo2").innerText = `The event.keycode is: ${code}`
    playPianoFromKey(code.toString());
}

function findKeyElementFromCodeNotes(noteArray, keyElements) {
    let correct = []
    for (const key of keyElements) {
        let split = key.id.split("_")
        if ((split[4] === noteArray[0]) && (split[2] == noteArray[1])){
            correct.push(key)
        }
    }
    return correct[0]
};

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
        key.addEventListener("click", function(event){
            playPianoFromClick(event.target);
        })
        pianoElement.appendChild(key)
        keys.push(key)
    };
}

function playPianoFromKey(keycode) {
    keysPressed.push(keycode);
    console.log(keysPressed);
    _audioSynth.setVolume(0.5);
    let piano = _audioSynth.createInstrument('piano');
    let note = codeNotes.find(element => element[2] == keycode)
    // need to figure out how to update duration
    piano.play(note[0], note[1], 2);
}

function playPianoFromClick(element){
    let piano = _audioSynth.createInstrument('piano');
    let keys = pianoElement.childNodes
    let key = findKeyFromArray(keys, element.id)
    let keySplit = key.id.split("_")
    for (const code of codeNotes){
        if ((code[0] === keySplit[4]) && (code[1] == keySplit[2])) {
            // need to figure out how to update duration
            piano.play(code[0], code[1], 2)
        }    
    }
}

function findKeyFromArray(keys, id) {
    let keyArr = []
    keys.forEach(function(key) {
        if (key.id === id) {
            keyArr.push(key)
        }
    })
    return keyArr[0]
}

createVisual();