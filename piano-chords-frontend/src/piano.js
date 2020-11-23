const codeNotes = {
    81: ["C", 3],
    50: ["C#", 3],
    87: ["D", 3],
    51: ["D#", 3],
    69: ["E", 3],
    82: ["F", 3],
    53: ["F#", 3],
    84: ["G", 3],
    54: ["G#", 3],
    89: ["A", 3],
    55: ["A#", 3],
    85: ["B", 3],
    73: ["C", 4],
    57: ["C#", 4],
    79: ["D", 4],
    48: ["D#", 4],
    80: ["E", 4],
    90: ["F", 4],
    83: ["F#", 4],
    88: ["G", 4],
    68: ["G#", 4],
    67: ["A", 4],
    70: ["A#", 4],
    86: ["B", 4],
    66: ["C", 5]
}

let keysPressed = [];


function playPiano(keycode) {
    keysPressed.push(keycode);
    console.log(keysPressed);
    let __audioSynth = new AudioSynth();
    __audioSynth.setVolume(0.5);
    let piano = __audioSynth.createInstrument('piano');
    // console.log(piano)

    // play note: Name(string), octave(int), duration in seconds(int)
    piano.play(codeNotes[keycode][0], codeNotes[keycode][1], 2);
}

function uniqueKeyCode(event) {
    let key = event.keyCode || event.which;
    document.getElementById("demo2").innerText = `The event.keycode is: ${key}`
    playPiano(key);
}
