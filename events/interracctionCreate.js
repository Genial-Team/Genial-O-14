const { Events } = require("discord.js")
module.exports = {
    config:{
        name: Events.InteractionCreate,
        enableEvents: true,
        canBeUsedOnDM: false
    },
    async execute(interaction){
        const interactionType = interaction.type;
        /**
         * on récupère la commande associée à l'interaction si elle existe
         * @returns {*}
         * @constructor
         */
        const getAssociatedCommand = () => {
            if ( interaction.customId ) {
                const receivedCommandName = commandList.commands.find( (command) => command.name === interaction.customId.split(":")[0] );
                return commandList.commandsOptionsResponse.find((command) => command.name === receivedCommandName.name);
            }
            return null;
        }
        //create a switch case for each interaction type except interactionType.APPLICATION_COMMAND
        switch (interactionType) {
            case 1:
                console.log(`interaction type is: ${interactionType} (PING)`)
                break;
            case 2:
                console.log(`interaction type is: ${interactionType} (APPLICATION_COMMAND)`)
                const command = commandList.commandsOptionsResponse.find( (c) => c.name === interaction.commandName )

                if ( !(command.config.canBeUsedOnDM || interaction.inGuild())) return interaction.reply(error.fr.checkingValidity.canNotBeUsedOnDM);

                await command.execute(interaction)

                break;
            case 3:
                // on exécute la fonction buttonResponse de la commande associée
                await getAssociatedCommand().buttonResponse(interaction)
                break;
            case 4:
                console.log(`interaction type is: ${interactionType} (APPLICATION_COMMAND_AUTOCOMPLETE)`)
                break;
            case 5:
                let modalData = {
                    id: interaction.customId,
                    fields : []
                }
                // on ajoute les champs du modal dans modalData.fields
                for (const interactionElement of interaction.components) {
                    modalData.fields.push(interactionElement.components[0])
                }
                // on exécute la fonction modalResponse de la commande associée
                getAssociatedCommand().modalResponse(interaction, modalData)
                    .catch( (err) => {
                        console.log("error in modalResponse function".red)
                        console.log(err)
                        interaction.reply({ content: error.fr.commandError.commonError, ephemeral: true })
                    })
                break;
            default:
                console.log("interaction type is: ", interactionType )
                break;
        }
    }
}