const codeNotes = {
    81: "C",
    50: "C#",
    87: "D",
    51: "D#",
    69: "E",
    82: "F",
    53: "F#",
    84: "G",
    54: "G#",
    89: "A",
    55: "A#",
    85: "B"
}

function playPiano(keycode) {
    let __audioSynth = new AudioSynth();
    __audioSynth.setVolume(0.5);
    let piano = __audioSynth.createInstrument('piano');
    console.log(piano)

    

    // play note: Name(string), octave(int), duration in seconds(int)
    piano.play(codeNotes[keycode], 4, 2);
}

function uniKeyCode(event) {
    let key = event.keyCode;
    document.getElementById("demo2").innerText = `The event.keycode is: ${key}`
    playPiano(key)
}