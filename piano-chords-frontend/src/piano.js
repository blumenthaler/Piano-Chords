function playPiano() {
    let __audioSynth = new AudioSynth();
    __audioSynth.setVolume(1.00);
    let piano = __audioSynth.createInstrument('piano');
    console.log(piano)

    // play note: Name(string), octave(int), duration in seconds(int)
    piano.play('C', 4, 2);
}

// Want Q to trigger C4 note
// Q keycode = 81  
function uniKeyCode(event) {
    var key = event.keyCode;
    document.getElementById("demo2").innerText = `The event.keycode is: ${key}`
    if (key === 81) {
        playPiano();
    }
}