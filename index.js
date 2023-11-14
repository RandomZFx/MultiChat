// WEBSOCKET CONNECTION

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs'); 
const data = "This is the new content of the file."; 
const WebSocket = require('ws');

var CONFIG = require('./config.json');
var kickUser = CONFIG.kick;
var twitchUser = CONFIG.twitch;

function saveLog (platform, chat) {
    var file = 'public/tmp/' + platform + '.log';
    var file2 = 'public/tmp/' + 'chat.log';
    var text =  '[' + platform + '] ' + chat + '\r\n';
    fs.appendFile(file, text, function (err) {
        if (err) return console.log(err);
    });
    fs.appendFile(file2, text, function (err) {
        if (err) return console.log(err);
    });
}

//KICK CONNECTION

const kickWS = new WebSocket(
    "wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false"
);

console.log("RandomZ Chat Linker")




kickWS.on("message", (req) => {
    const data = JSON.parse(req);
    //console.log(data.data.toString());

    if (data.event == "pusher:connection_established"){
        saveLog("SERVER", "KICK SCRIPT WROKING")
        console.log("connection established to KickAPI!");
        kickWS.send(
            JSON.stringify({
                event: "pusher:subscribe",
                data: { auth: "", channel: kickUser },
            })
        );
    }


    if (data.event == "App\\Events\\ChatMessageEvent") {
        const msgData = JSON.parse(data.data);
        //console.log(msgData);

        //WHAT I SEE
        console.log("[KICK]", msgData.sender.username, ": " ,msgData.content);

        saveLog("KICK", msgData.sender.username + ": " + msgData.content)

        //fs.writeFileSync('/tmp/chat', "[KICK]", msgData.sender.username, ": " ,msgData.content);
    }
});


//TWITCH

const tmi = require('tmi.js');

const TwitchClient = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [ twitchUser ]

});

    TwitchClient.connect();
    saveLog("SERVER", "TWITCH SCRIPT WORKING")
    console.log('TWITCH API CONNECTED')

TwitchClient.on('message', (channel, tags, message, self) => {
    console.log("[TWITCH]", `${tags['display-name']}: ${message}`);
    saveLog("TWITCH", `${tags['display-name']}: ${message}`)
});



