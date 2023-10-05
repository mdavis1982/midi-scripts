/**
 * Step Sequencer
 * ==============
 * Play a step sequence by repeatedly triggering a trigger note.
 *
 * This can be useful for playing tuned percussion passages from an
 * electronic drum pad like the DTX Multi 12 or SPD-SX.
 *
 * Parameters:
 * -----------
 * sequences:    The array of sequences that can be played.
 *
 * The shape of a sequence is as follows:
 *
 * name:        An internal name for the sequence.
 * currentStep: Used internally to track where we are in the sequence.
 * notes:       An array of note names or arrays of note names which
 *              will be played together as chords.
 *
 * Copyright (c) 2023 Matthew Davis
 */

var sequences = {
    'C3': {
        name: 'Happy Birthday',
        currentStep: 0,
        notes: [
            'C3', 'C3', 'D3', 'C3', 'F3', 'E3',
            ['C3', 'E3', 'G3', 'C4']
        ]
    },

    'D3': {
        name: 'Twinkle Twinkle Little Star',
        currentStep: 0,
        notes: [
            'C3', 'C3', 'G3', 'G3', 'A3', 'A3', 'G3',
            'F3', 'F3', 'E3', 'E3', 'D3', 'D3', 'C3',
            ['C3', 'E3', 'G3', 'C4']
        ]
    },
}

function HandleMIDI(event)
{
    // If we don't have a trigger note send the event unchanged
    if (! (MIDI.noteName(event.pitch) in sequences)) {
        event.send();

        return;
    }

    var data = {
        event: event,
        triggerNote: MIDI.noteName(event.pitch),
        sequence: sequences[MIDI.noteName(event.pitch)],
        numberOfSteps: sequences[MIDI.noteName(event.pitch)].notes.length - 1,
    }

    if (event instanceof NoteOn) HandleNoteOn(data);
    if (event instanceof NoteOff) HandleNoteOff(data);
}

function HandleNoteOn(data)
{
    CreateEvents(data.sequence.notes[data.sequence.currentStep], true, data.event.channel, data.event.velocity)

    sequences[data.triggerNote].currentStep++;

    if (sequences[data.triggerNote].currentStep > data.numberOfSteps) {
        sequences[data.triggerNote].currentStep = 0;
    }
}

function HandleNoteOff(data)
{
    var previousStep = (data.sequence.currentStep == 0) ? data.numberOfSteps : data.sequence.currentStep - 1;

    CreateEvents(data.sequence.notes[previousStep], false, data.event.channel, data.event.velocity)
}

function CreateEvents(notes, on, channel, velocity)
{
    notes = (typeof notes === 'string') ? Array(notes) : notes;

    for (var n = 0; n < notes.length; n++) {
        newEvent = on ? new NoteOn() : new NoteOff();
        newEvent.pitch = MIDI.noteNumber(notes[n]);
        newEvent.channel = channel;
        newEvent.velocity = velocity;
        newEvent.trace();
        newEvent.send();
    }
}
