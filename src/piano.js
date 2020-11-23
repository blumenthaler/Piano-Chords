function playPiano() {
    let __audioSynth = new AudioSynth();
    __audioSynth.setVolume(1.00);
    let piano = __audioSynth.createInstrument('piano');
    console.log(piano)

    // play note: Name(string), octave(int), duration in seconds(int)
    piano.play('C', 4, 2);
}