let chordMode = true;
let arpMode = true;
const codeNotes = [
    ["C", 3, 81, "Q"],
    ["C#", 3, 50, "2"],
    ["D", 3, 87, "W"],
    ["D#", 3, 51, "3"],
    ["E", 3, 69, "E"],
    ["F", 3, 82, "R"],
    ["F#", 3, 53, "5"],
    ["G", 3, 84, "T"],
    ["G#", 3, 54, "6"],
    ["A", 3, 89, "Y"],
    ["A#", 3, 55, "7"],
    ["B", 3, 85, "U"],
    ["C", 4, 73, "I"],
    ["C#", 4, 57, "9"],
    ["D", 4, 79, "O"],
    ["D#", 4, 48, "0"],
    ["E", 4, 80, "P"],
    ["F", 4, 90, "Z"],
    ["F#", 4, 83, "S"],
    ["G", 4, 88, "X"],
    ["G#", 4, 68, "D"],
    ["A", 4, 67, "C"],
    ["A#", 4, 70, "F"],
    ["B", 4, 86, "V"],
    ["C", 5, 66, "B"],
    ["C#", 5, 72, "H"],
    ["D", 5, 78, "N"],
    ["D#", 5, 74, "J"],
    ["E", 5, 77, "M"],
    ["F", 5, 188, ","],
    ["F#", 5, 76, "L"],
    ["G", 5, 190, "."]
]

document.addEventListener("DOMContentLoaded", () => {
    createVisual();
})

function createVisual() {
    generateChordForm();
    for (i = 0; i < codeNotes.length; i++) {
        let key = document.createElement('div')
        let label = document.createElement('label')
        let noteName = codeNotes[i][0]
        label.innerText = codeNotes[i][3]
        key.appendChild(label)
        key.setAttribute('id', `${i}_oct_${codeNotes[i][1]}_note_${noteName}`)
        label.setAttribute('for', `${key.id}`)
        // creates second label for Note Name; may want to refactor
        let keyLabel = document.createElement('label')
        keyLabel.innerText = noteName
        keyLabel.className = "key_label"
        keyLabel.setAttribute('id', `label_${key.id}`)
        keyLabel.style.display = "none";
        key.appendChild(keyLabel)

        if (noteName.length === 2) {
            key.setAttribute("class", "key black")
            label.className = "blackLabel"
        }
        else {
            key.setAttribute("class", "key white")
            label.className = "whiteLabel"
        }
        key.addEventListener("mouseover", function(event) {   
            if (chordMode) {
                let codes = getChordNotes(event.target);
                let keys = codes.map(code => findKeyElementFromCodeNotes(code))
                displayCorrectKeys(keys)
            }
            else {
                displayCorrectKey(event.target)
            }
        })
        key.addEventListener("mouseout", function(event) {
            unhighlight(event.target)
        })
        key.addEventListener("mousedown", function(event){
            // this kind of code repeats itself;
            // should definitely refactor this, will make arpeggiate mode potentially easier
            // i.e. if chordMode, playChordFromClick(keys) => if arpMode, set Timeout to play each note
            if (chordMode) {
                let codes = getChordNotes(event.target);
                let keys = codes.map(code => findKeyElementFromCodeNotes(code))
                keys.forEach(key => playPianoFromClick(key))
            }
            else {
                playPianoFromClick(event.target);
            }
        })
        pianoElement.appendChild(key)
    };
}

let _audioSynth = new AudioSynth();
let keysPressed = [];
const pianoElement = document.getElementById("keyboard");
const keyElements = document.getElementsByClassName("key")

function playThePiano(event) {
    let el = event.target
    let klass = el.className
    if (klass === "chord-input") {
        return false;
    }
    if (!event.repeat) {
        // get keycode from keypress, find corresponding note from codeNotes, find key element for that note
        let code = event.keyCode || event.which;
        let noteArray = codeNotes.find(element => element[2] === code)
        let noteElement = findKeyElementFromCodeNotes(noteArray);
        // if chordMode, get all elements for that chord and play them
        if (chordMode) {
            let codes = getChordNotes(noteElement)
            let keys = codes.map(code => findKeyElementFromCodeNotes(code))
            displayCorrectKeys(keys)
            codes.forEach(code => playPianoFromKey(code[2]))
        }
    // if not chordMode, play single note
        else {
            displayCorrectKey(noteElement)
            playPianoFromKey(code.toString());
        }
    }
}

function findKeyElementFromCodeNotes(noteArray) {
    for (const key of keyElements) {
        let split = key.id.split("_")
        if ((split[4] === noteArray[0]) && (split[2] == noteArray[1])) {
            return key
        }
    }
};

function displayCorrectKeys(keys) {
    keys.forEach(el => {
        displayCorrectKey(el)
    })
}

function displayCorrectKey(element) {
    element.style.backgroundColor = "#FFBF46"
    let keyLabel = document.getElementById(`label_${element.id}`)
    keyLabel.style.display = "inline"
}

function stopHighlight(event) {
    let code = event.keyCode || event.which;
    let find = codeNotes.find(element => element[2] === code)
    let element = findKeyElementFromCodeNotes(find);
    unhighlight(element);
}

function unhighlight(element) {
    if (chordMode) {
        let codes = getChordNotes(element);
        let keys = codes.map(code => findKeyElementFromCodeNotes(code))
        unhighlightKeys(keys)
    }
    else {
        unhighlightKey(element)
    }
}

function unhighlightKeys(elements) {
    elements.forEach(el => {
        unhighlightKey(el)
    })
}

function unhighlightKey(element) {
    if (element.className === "key white") {
        element.style.backgroundColor = "white";
    }
    else {
        element.style.backgroundColor = "black";
    }
    let keyLabel = document.getElementById(`label_${element.id}`)
    keyLabel.style.display = "none"
}

function getChordNotes(element) {
    let chord = findChord()
    let structure = chord.structure.split(", ").map(integer => parseInt(integer))
    // console.log(structure)
    let startNote = codeNotes[element.id.split("_")[0]]
    // starting at the start note, return they key elements for each note in structure (chord)
    let index = codeNotes.indexOf(startNote) 
    let notesRange = codeNotes.slice(index, (index + (structure.reduce((a, b) => a + b, 0) + 1))) 
    let codes = []
    for (i = 0; i < structure.length; i++) {
        codes.push(notesRange[structure[i]])
    }
    return codes
}

function findChord() {
    let name = drop.value
    let chord = chordsArray.find(chord => chord.name === name)
    return chord
}

function playPianoFromKey(keycode) {
    _audioSynth.setVolume(0.3);
    let piano = _audioSynth.createInstrument('piano');
    let note = codeNotes.find(element => element[2] == keycode)
    piano.play(note[0], note[1], 2);
}

function playPianoFromClick(element){
    _audioSynth.setVolume(0.3)
    let piano = _audioSynth.createInstrument('piano');
    let keys = pianoElement.childNodes
    let key = findKeyFromArray(keys, element.id)
    let keySplit = key.id.split("_")
    for (const code of codeNotes){
        if ((code[0] === keySplit[4]) && (code[1] == keySplit[2])) {
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
