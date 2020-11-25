I have the chord info from the backend (all chord types from db)

I have created options for select from this data

I need to be able to select chord types and trigger actions so that when a note is played, that chord structure is built on top of that note.
(if I select Major Triad, then go to C on the keyboard, it should highlight and play a C Major Triad)

- from selection, typically there is a form req involved
1. form tag, action to index.html(?) I think

2. Upon selection, index.js needs to recognize that selection (probably by name) 
    <!-- -   function findSelectedElement() {
	        document.getElementsByClassName("whatever").find(el => el.selected)
        } 
        - let selectedChord = Chord.find(name === findSelectedElement().innerText) # figure out actual syntax -->

3. After recognition, chord structure needs to be implemented (new function for all chord types based on STRUCTURE string)
    - chord mode (boolean); if chordmode, then trigger this new function on *key event listeners*
        - if false, normal keyboard functions
    - chord structure.split; => integers
    - first note(mouseover note) + integers[0] half-steps + integers[1] half-steps
    - mouseover = highlight the notes from chord structure, show note names (pull chord's notes from codeNotes object)
    - click = play each note together