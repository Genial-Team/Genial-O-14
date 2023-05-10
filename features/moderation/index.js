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
                    modalResponse: command.modalResponse,
                    buttonResponse: command.buttonResponse
                })
            } )

        console.log("moderation command initialized".green)
    }
}