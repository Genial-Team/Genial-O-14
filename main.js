const { readdirSync } = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve( `${__dirname}/config/.env` ) });
const { Client, GatewayIntentBits, Partials, REST, Routes } = require("discord.js");
const colors = require('colors');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel],
})

global.commandList = {
    commands: [],
    commandsOptionsResponse: []
};
global.discordClient = client;
global.error = require("./config/error");
global.dataBase = require("./database/getModels")
global.colors = colors;
global.colorScheme = require("./config/colorScheme");


// load all available command
readdirSync(`${__dirname}/features/`)
    .forEach( (folderName) => {
        const indexFile = require(`${__dirname}/features/${folderName}/index.js`);

        if ( indexFile.config.enableFeature !== true ) return;

        indexFile.init(client)
    } )

readdirSync(`${__dirname}/events/`)
    .forEach( (fileName) => {
        const eventFile = require(`${__dirname}/events/${fileName}`);

        if ( !eventFile.config.enableEvents ) return;

        client.on( eventFile.config.name, (paramOne, paramTwo) => {
            eventFile.execute(paramOne, paramTwo)
                .then(console.log)
        })
    } )

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const sendCommand = async () => {
    if ( commandList.length === 0 ) return console.log(colors.red("[app] aucune commande trouvé"));

    const applicationID = client.application.id,
        serverID = process.env.DEV_SERVERID;

        if ( process.env.NODE_ENV.trim() === "dev" )  {
        // send SlashCommand in one guild
            try {
                await rest.put(
                    Routes.applicationGuildCommands(applicationID, serverID),
                    { body: commandList.commands },
                );
            }catch (e) {
                console.log(colors.red("[app] une commande est invalide"), e);
                console.log(e)
            }
            console.log(colors.green(`[app] slash commands reloaded in ${ colors.blue('1')} guild." `));
            }
        if (process.env.NODE_ENV.trim() === "prod" ) {
                // send SlashCommand in all guild
                await rest.put(
                    Routes.applicationCommands(applicationID),
                    { body: commandList.commands },
                );

                console.log(colors.green(`[app] slash commands reloaded in all guild.`));
            }
}


client.login(process.env.DISCORD_TOKEN)
.then( () => {
    sendCommand()
        .catch(console.log)

} )
.catch(console.log)