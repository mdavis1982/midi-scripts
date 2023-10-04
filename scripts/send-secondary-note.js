/**
 * Secondary Note
 * ==============
 * Send a secondary note with the first note that is played.
 *
 * This can be useful to trigger a keyswitch right before the first note
 * in lieu of MainStage being able to send a MIDI note on patch change.
 *
 * Parameters:
 * -----------
 * note:     The note to send as a secondary note
 * velocity: The velocity to send the secondary note at
 * duration: The duration the note should last
 *
 * Copyright (c) 2023 Matthew Davis
 */

const note = 'D2';
const velocity = 127;
const duration = 1000;

var hasSent = false;

function HandleMIDI(event)
{
    if (event instanceof NoteOn && ! hasSent) {
        noteOn = new NoteOn();
        noteOn.pitch = MIDI.noteNumber(note);
        noteOn.velocity = velocity;
        noteOn.send();
        noteOn.trace();

        noteOff = new NoteOff();
        noteOff.pitch = MIDI.noteNumber(note);
        noteOff.velocity = velocity;
        noteOff.sendAfterMilliseconds(duration);
        noteOff.trace();

        hasSent = true;
    }

    event.trace();
    event.send();
}
