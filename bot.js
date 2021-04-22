const tmi = require('tmi.js');
var fs = require('fs');
const os = require('os');
require('dotenv').config();
//const du = require('du');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var sent = Number(localStorage.getItem("number"));
var senta = 0;
var path = process.env.FILEPATH;


var debugMode = true;
var loggerMode = true;

var username = process.env.AUSERNAME;
var password = process.env.APASSWORD;

console.log("Done! Starting login");
console.log(process.env.CHANNELS.split(","))

//Main Bot

//fs.appendFile("message.txt", "Hello ! You are", (err) => { if (err) { console.log(err);}}); 

// Define configuration options
const opts = {
  identity: {
    username: username,
    password: password
  },
  channels: process.env.CHANNELS.split(",")
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (debugMode == true){
  target = target;
  console.log(target);
  console.log(context);
  console.log(msg);
  console.log(self);
  }
  //Dubug

  if (self) { return; } // Ignore messages from the bot

  if (loggerMode == true){
    logger(target, context, msg);
  }

  // Remove whitespace from chat message
  const commandName = msg.trim();

  if (target == "#flonc_"){
    lowered = commandName.toLowerCase();
    if (lowered.includes("noob") == true){
      client.say(target, "@"+context["username"]+" that is not nice.");
    }
  }

  if (target == "#airplanegobrr_"){
  //Whitelist mode ^^
  //To remove replace airplane with target
  msgChecker(target, context, msg, commandName);

  if (commandName.startsWith("!dice")) {
    rollDice(target, context, msg, commandName);
  }

  if (commandName === '!followonly') {
    followOnly(target, context, msg, commandName);
    //Follower only mode command (will add args later!)
  }
  if (commandName === '!clearchat') {
    clearChat(target, context, msg, commandName);
    //Clear chat command
  }
  if (commandName.startsWith("!args")) {
    msg2 = commandName.split(" ");
    console.log(msg2);
    console.log(msg2["1"]);
  }
  
  if (commandName.startsWith("  ")){
    say(target, context, msg, commandName);
  } 
  if (commandName.startsWith("!stop")){
    stopBot(target, context, msg, commandName);
  } 
  if (commandName === "!channel"){
    runChannels(target, context, msg, commandName);
  }
  if (commandName.startsWith("!add")){
    add(target, context, msg, commandName);
  }
}
}

function logger(target, context, msg, commandName){
  var uptime = process.uptime();
  var osuptime = os.uptime()

  function format(seconds){
    function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }
  //Uptime control

  //fs.appendFile(path+"chatlog/chatlogger."+target+".txt", context["username"]+":"+msg+"\n", (err) => { if (err) { console.log(err);}});
  //fs.appendFile(path+"chatlog/adv/chatlogger.adv."+target+".txt", JSON.stringify(context)+":"+msg+"\n", (err) => { if (err) { console.log(err);}});
  //Saves chat

  console.log("\n");
  
  sent = sent+1;
  senta = senta+1;
  console.log("Channel: "+target);
  console.log("User: "+context["username"]);
  console.log(msg);

  console.log("\n");

  console.log("OVER "+sent+" messages have been logged!");
  console.log("There is NO content filter on the chat sorry if you see stuff!");
  console.log("Uptime: "+format(uptime));
  console.log("Computer uptime: "+format(osuptime));
  localStorage.setItem('number', sent);

  if (senta == 50){
    senta=0;
    localStorage.setItem("number", sent);
  }
}

function msgChecker(target, context, msg, commandName){
  if (commandName.startsWith("Wanna become famous")) {
    client.say(target, "Auto banned user @"+ context["username"]+" for scams")
    client.ban(target,context["username"],"Scams")
  }
}

function rollDice(target, context, msg, commandName){
  msg2 = commandName.split(" ");
  num = Math.floor(Math.random() * msg2["1"]) + 1;
  console.log(num+" was the rolled number");
  client.say(target, `You rolled a ${num}`);
}

function followOnly(target, context, msg, commandName){
  if (context["mod"]=="true" || "#"+context["username"] == target) {
    //Will check if the "user" is a mod or broadcaster
    client.say(target, "Chat is now going into follower only mode!");
    //Sends chat
    client.followersonly(target);
    //Turns on follower only mode
  } else {
    client.say(target, "You are not a mod or broadcaster!");
    //Will send if the checking fails
  }
}

function clearChat(target, context, msg, commandName){
  if (context["mod"]=="true" || "#"+context["username"] == target) {
    //Will check if the "user" is a mod or broadcaster
    client.clear(target);
    //Clears chat
    client.say(target, "Chat has been cleared by user: "+"@"+context["username"]);
  } else {
    client.say(target, "You are not a mod or broadcaster!");
    //Will send if the checking fails
  }
}

function say(target, context, msg, commandName){
  if (context["mod"]=="true" || "#"+context["username"] == target || context["username"] == "airplanegobrr_") {
    msg2 = commandName.split(" ");
    channel = msg2[1];
    console.log(msg2.slice(2).join(" "));
  }
}

function stopBot(target, context, msg, commandName){
  if (context["mod"]=="true" || "#"+context["username"] == target || context["username"] == "airplanegobrr_") {
    client.say(target, "User: @"+context["username"]+" stopped the bot");
    process.exit(1);
  }
}

function runChannels(target, context, msg, commandName){
  client.say(target,"I am logging these channels: "+JSON.stringify(opts["channels"]));
}

function add(target, context, msg, commandName){
  fs.appendFile(path+"add.txt", context["username"]+":"+msg+"\n", (err) => { 
    if (err) {
       console.log(err);}
      });
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port, target, context, msg, self) {
  console.log(`* Connected to ${addr}:${port}`);
  console.log("Bot is now joinning channels");
}