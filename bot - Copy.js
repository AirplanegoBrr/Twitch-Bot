const tmi = require('tmi.js');
var fs = require('fs');
//var filesize = require("filesize");

const du = require('du');

var sent = 0;
var senta = 0;
var sentb = 0;


//fs.appendFile("message.txt", "Hello ! You are", (err) => { if (err) { console.log(err);}}); 

// Define configuration options
const opts = {
  identity: {
    username: "airplanegobrr_bot",
    password: "fuckofflol"
  },
  channels: [
    "airplanegobrr_bot",
    "airplanegobrr_",
    "brad1758",
    "ludwig",
    "ranboolive",
    "adrianbssyt",
    "moistcr1tikal",
    "ninja",
    "xqcow",
    "darkosto",
    "raginxpanda",
    "welyn",
    "swaggersouls",
    "amouranth",
    "oxsidiann",
    "ottomated",
    "tomstanniland"
  ]
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
  console.log(target);
  console.log(context);
  console.log(msg);
  console.log(self);
  if (self) { return; } // Ignore messages from the bot
  fs.appendFile("J:\chatlog/chatlogger."+target+".txt", context["username"]+":"+msg+"\n", (err) => { if (err) { console.log(err);}});

  fs.appendFile("J:\chatlog/adv/chatlogger.adv."+target+".txt", JSON.stringify(context)+":"+msg+"\n", (err) => { if (err) { console.log(err);}});

  console.log("\n\n\n")
  
  sent = sent+1
  senta = senta+1
  sentb = sentb+1

  console.log("OVER "+sent+" have been logged!")
  console.log(senta)

  if (senta == 1000){
    senta = 0
    let size = du('F:\chatlog')
    console.log(`The size of chat logs are: ${size} bytes`)
    fs.appendFile("J:\yes.txt", "The size of chat logs are: "+ size +" bytes", (err) => { if (err) { console.log(err);}});
  }


  // Remove whitespace from chat message
  const commandName = msg.trim();



  if (target == "#airplanegobrr_"){
  //Whitelist mode ^^

  if (commandName == "!filesize"){
    stats = fs.statSync("J:\chatlog/chatlogger."+target+".txt");
    fileSizeInMb = filesize(stats.size, {round: 0});
    send = JSON.stringify(fileSizeInMb)
    console.log(fileSizeInMb)
    client.say("The file size for this streamer is: "+ JSON.stringify(fileSizeInMb))
  }

  if (commandName.startsWith("!dice")) {
    msg2 = commandName.split(" ");
    console.log(msg2["1"])
    num = Math.floor(Math.random() * msg2["1"]) + 1;
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);

  } else if (commandName === '!followonly') {
    //Follower only mode command (will try to add args later!)
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
  } else if (commandName === '!clearchat') {
    //Clear chat command
    if (context["mod"]=="true" || "#"+context["username"] == target) {
      //Will check if the "user" is a mod or broadcaster
      client.clear(target);
      //Clears chat
      client.say(target, "Chat has been cleared by user: "+"@"+context["username"]);
    } else {
      client.say(target, "You are not a mod or broadcaster!");
      //Will send if the checking fails
    }
  } else if (commandName.startsWith("!test")) {
    msg2 = commandName.split(" ");
    console.log(msg2);
    console.log(msg2["1"]);

  } else if (commandName.startsWith("!say")){
    if (context["mod"]=="true" || "#"+context["username"] == target || context["username"] == "airplanegobrr_") {
      msg2 = commandName.split(" ");
      client.say(target, "pineapples");
      //Seconded if
    }
    //First if
  } else if (commandName.startsWith("!end")){
    if (context["mod"]=="true" || "#"+context["username"] == target || context["username"] == "airplanegobrr_") {
      process.exit(1)
      //Seconded if
    }
    //First if
  } else if (commandName === "!channels"){
    client.say(target, "I am logging these channels:")
    client.say(target,JSON.stringify(opts["channels"]))

  } else if (commandName.startsWith("!add")){
    fs.appendFile("J:\add.txt", context["username"]+":"+msg+"\n", (err) => { if (err) { console.log(err);}});
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port, target, context, msg, self) {
  console.log(`* Connected to ${addr}:${port}`);
}