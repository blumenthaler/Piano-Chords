let chordMode = true;

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
    ["C", 5, 66, "B"]
]

let keysPressed = [];
let _audioSynth = new AudioSynth();
let pianoElement = document.getElementById("keyboard");
const keyElements = document.getElementsByClassName("key")

function stopHighlight(event) {
    let code = event.keyCode || event.which;
    let find = codeNotes.find(element => element[2] === code)
    let element = findKeyElementFromCodeNotes(find);
    if (chordMode) {
        let codes = getChordNotes(element)
        let keys = codes.map(code => findKeyElementFromCodeNotes(code))
        // refactor into another method
        keys.forEach(el => {
            if (el.className === "key white") {
                el.style.backgroundColor = "white";
            }
            else {
                el.style.backgroundColor = "black";
            }
            let keyLabel = document.getElementById(`label_${el.id}`)
            keyLabel.style.display = "none"
        })
    }   
}

function uniqueKeyCode(event) {
    let code = event.keyCode || event.which;
    let find = codeNotes.find(element => element[2] === code)
    let element = findKeyElementFromCodeNotes(find);
    if (chordMode) {
        let codes = getChordNotes(element)
        let keys = codes.map(code => findKeyElementFromCodeNotes(code))
        displayCorrectKeys(keys)
    }
    else {
        element.style.backgroundColor = "#FFBF46";
        setTimeout(function() {
            if (element.className === "key white") {
                element.style.backgroundColor = "white";
            }
            else {
                element.style.backgroundColor = "black";
            }
        }, 500)
        document.getElementById("demo2").innerText = `The event.keycode is: ${code}`
        playPianoFromKey(code.toString());
    }
}

function findKeyElementFromCodeNotes(noteArray) {
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
        let label = document.createElement('label')
        label.innerText = codeNotes[i][3]
        key.appendChild(label)
        key.setAttribute('id', `${i}_oct_${codeNotes[i][1]}_note_${codeNotes[i][0]}`)
        label.setAttribute('for', `${key.id}`)

        let keyLabel = document.createElement('label')
        keyLabel.innerText = key.id.split("_")[4]
        keyLabel.className = "key_label"
        keyLabel.setAttribute('id', `label_${key.id}`)
        keyLabel.style.display = "none";
        key.appendChild(keyLabel)

        if (codeNotes[i][0].length === 2) {
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
                event.target.style.backgroundColor = "#FFBF46"
            }
        })
        key.addEventListener("mouseout", function(event) {
            if (chordMode) {
                let codes = getChordNotes(event.target);
                let keys = codes.map(code => findKeyElementFromCodeNotes(code))
                let labels = document.getElementsByClassName('key_label')
                for (const label of labels) {
                    label.style.display = "none"
                }
                keys.forEach(el => {
                    if (el.className === "key white") {
                        el.style.backgroundColor = "white"
                    }
                    else {
                        el.style.backgroundColor = "black"
                    }
                })
            }
            else {
                if (key.className === "key white") {
                    event.target.style.backgroundColor = "white";
                }
                else {
                    event.target.style.backgroundColor = "black";
                }
            }
        })
        key.addEventListener("click", function(event){
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
        keys.push(key)
    };
}

function displayCorrectKeys(keys) {
    keys.forEach(el => {
        el.style.backgroundColor = "#FFBF46";
        let keyLabel = document.getElementById(`label_${el.id}`)
        keyLabel.style.display = "inline"
    })
}

const testChord = new Chord("test minor", "3, 4", "m, Minor, Test")

function getChordNotes(element) {
    let structure = testChord.structure.split(", ").map(el => parseInt(el))
    structure.unshift(0)
    let startNote = codeNotes[element.id.split("_")[0]]
    // starting at the start note, return they key elements for each note in structure (chord)
    let index = codeNotes.indexOf(startNote)
    let notesRange = codeNotes.slice(index, (index + (structure.reduce((a, b) => a + b, 0) + 1)))
    let codes = []
    codes.push(notesRange[structure[0]])
    for (i = 1; i < structure.length; i++) {
        if (i === 1) {
            codes.push(notesRange[structure[i]])
        }
        else {
        codes.push(notesRange[structure.slice(structure.length - i).reduce((a, b) => a+b, 0)])
        }
    }
    return codes
}


function playPianoFromKey(keycode) {
    keysPressed.push(keycode);

    console.log(keysPressed);
    _audioSynth.setVolume(0.3);
    let piano = _audioSynth.createInstrument('piano');
    let note = codeNotes.find(element => element[2] == keycode)
    // need to figure out how to update duration
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