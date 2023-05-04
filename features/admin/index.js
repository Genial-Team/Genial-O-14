const { readdirSync } = require("fs")

module.exports = {
    config: {
        enableFeature: true,
    },
    init(client){

        readdirSync(`${__dirname}/commands/`)
            .filter((file) => file.endsWith(".js"))
            .forEach( (file) => {

                const command = require(`${__dirname}/commands/${file}`)
                // si la commande est activée
                if ( !command.config.active ) return;
                // met la commande dans la list qui sera envoyé à discord
                commandList.commands.push(command.initCommand())
                commandList.commandsOptionsResponse.push({
                    name: command.config.name,
                    config: command.config,
                    execute: command.execute,
                    modalResponse: command.modalResponse ? command.modalResponse : null,
                    buttonResponse: command.buttonResponse ? command.buttonResponse : null
                })
                //crée l'interaction pour répondre à la commande
                // client.on( "interactionCreate", async (interaction) => {
                //     if (interaction.commandName === command.config.name) {
                //         if ( !(command.config.canBeUsedOnDM || interaction.inGuild())) return interaction.reply(error.fr.checkingValidity.canNotBeUsedOnDM);
                //         await command.execute(interaction)
                //     }
                // })

            } )

        console.log("moderation command initialized".green)
    }
}