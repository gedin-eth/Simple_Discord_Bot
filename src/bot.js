//main entry point to bot

require('dotenv').config();
//load all environmental variables

// to reference global variable need to reference the
// global object
//console.log(process.env.DISCORDJS_BOT_TOKEN);

// discord.js is 

//oobject destructing inside currly braces, importing exports
// using require fucntion

//need to specify client intent.
// ** https://stackoverflow.com/questions/68701446/discord-api-valid-intents-must-be-provided-for-the-client

const {Client, Intents, WebhookClient} = require('discord.js');

//  client object is a instance of client class
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX ="$";

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
);

//20.55 in video
client.on('ready', () => {
    console.log(client.user.tag + ' has logged in.');
});

//when we want to create event based of a user message event
client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    console.log(message.author.tag +' : ' + message.content);
    if (message.content === '!wl') {
        message.channel.send('Congratulations! ' + message.author.tag + ' you have been whitelisted')
    }
})


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        // need to clear spaces in text using .trim() function
        // split it up using the space character
        // we also deconstruct an array since it will return an array
        // we use the spreader operator "..." for mac 
        // first element in array is deconstructed into CMD NAME Variable
        // every other element after the cmd name will be stored in "..args"
        //Args gives you a single variable... and adding the spreader operator "..."
        // gives you all the arguments
        // to get rid of space arguments must use /\s+/
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        console.log(CMD_NAME);
        console.log(args);

        if (CMD_NAME === 'kick'){

            if (!message.member.permissions.has('KICK_MEMBERS'))

            //if (!message.member.hasPermission('KICK_MEMBERS'))
                return message.reply('You do not have permissions to use that command');
            // expect a command, there to be an ID argument of at least 1
            if (args.length === 0) return message.reply('Please provide an ID');
            // Kicking Users
            // ** user must be in guild to 'kick'
            // ** user doesnt need to be in guild to 'ban'

            // 1. make sure at first user is in the guild
            // 2. get member object variable from guild 
            // ** use client or object within function to find needed data
            // 3. members = Guild member manager, has a property called cache that
            // is a collection [ which is a map with additional utility methods, used
            // in discord ubstead if arrays]. This is cause everything is mapped by an id
            // referencing is faster than looping through array



            const member = message.guild.members.cache.get(args[0]);
            // 1. cache - collection that map id of guild number to guild object
            // 2. call .get() ... same method for map, needs id

            console.log(member);
            //message.channel.send("Kicked the user");

            // if member exist, the member will be kicked from the server.
            if (member) {
                member.kick()
                .then((member) => message.channel.send(member+ ' was kicked.'))
                .catch((err) => message.channel.send('I cannot kick ' + member + ' :('));
            } else {
                message.channel.send('That member was not found');
            }  
        } else if (CMD_NAME === 'ban') {
            if (!message.member.permissions.has('BAN_MEMBERS'))
                return message.reply('You do not have permissions to use that command');
            if (args.length === 0) return message.reply('Please provide an ID');
            
            try {

            const user = await message.guild.members.ban(args[0]);
            message.channel.send('User was banned successfully');
            console.log(user);
            }catch (err) {
                console.log(err);
                message.channel.send('An error occurred. Either I do not have permissions or the user was not found.');
            }
        } else if (CMD_NAME === ' announce'){
            console.log(args);
            const msg = args.join(' ');
            console.log(msg);
            webhookClient.send(msg);

        }
    }
});
//simple text commands for chat in discord
// need a prefix symbol before the command

//method will be using login
// pass a token into a bot
//to keep it private, leave it in environment variable
//reference the environment variable

client.on('messageReactionAdd',(reaction, user) => {

    console.log('Hello');
    const {name} = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === '957250646925512755'){
        switch(name){
            case '957251103563595797':
                member.roles.add('957252844711477268');
                break;
            case '957252588066193408':
                member.roles.add('957253082297815101');
                break;
            case '957252630688702505':
                member.roles.add('957253199096582154');
                break;
            case '957252660602474546':
                member.roles.add('957253315052318760');
                break;
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
  