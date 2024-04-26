var WebSocket = require('ws');
var easymidi = require('easymidi');
var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();
var input = new easymidi.Input('Minilab3 MIDI');

var output = new easymidi.Output('USB MIDI Interface');
var default_channel = 0;


input.on('noteon', function (msg) {
    output.send('noteon', {
        note: msg.note,
        velocity: 127,
        channel: msg.channel
    });
});

input.on('noteoff', function (msg) {
    output.send('noteoff', {
        note: msg.note,
        velocity: 0,
        channel: msg.channel
    });
});


const ws = new WebSocket('ws://localhost:3000');
var received_note = "";

ws.on('error', console.error);

ws.on('open', function open() {
    console.log('Socket opens');
    output.send('noteoff', {
        note: 0,
        velocity: 0,
        channel: default_channel
    });
});

ws.on('message', function message(data) {
    console.log('received: %s', data);

    var msg = data.toString().split('/');
    var action = msg[3];
    var received_note = msg[4];
    if (action == "noteon") {
        console.log(action);
        output.send('noteon', {
            note: received_note,
            velocity: 127,
            channel: default_channel
        });

    } else if (action = "noteoff") {
        output.send('noteoff', {
            note: received_note,
            velocity: 0,
            channel: default_channel
        });
    } {

    }
});
