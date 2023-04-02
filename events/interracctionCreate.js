const { Events } = require("discord.js")
module.exports = {
    config:{
        name: Events.InteractionCreate,
        enableEvents: true,
        canBeUsedOnDM: false
    },
    async execute(interaction){
        const interactionType = interaction.type;

        //create a switch case for each interaction type exxept interactionType.APPLICATION_COMMAND
        switch (interactionType) {
            case 1:
                console.log(`interaction type is: ${interactionType} (PING)`)
                break;
            case 2:
                console.log(`interaction type is: ${interactionType} (APPLICATION_COMMAND)`)
                break;
            case 3:
                console.log(`interaction type is: ${interactionType} (MESSAGE_COMPONENT)`)
                break;
            case 4:
                console.log(`interaction type is: ${interactionType} (APPLICATION_COMMAND_AUTOCOMPLETE)`)
                break;
            case 5:
                console.log(`interaction type is: ${interactionType} (MODAL_SUBMIT)`)
                let modalData = {
                    id: interaction.customId,
                    fields : []
                }
                // on ajoute les champs du modal dans modalData.fields
                for (const interactionElement of interaction.components) {
                    modalData.fields.push(interactionElement.components[0])
                }
                // on cherche la commande associée au modal
                const receivedCommandName = commandList.commands.find( (command) => command.name === interaction.customId.split(":")[0] );
                const associatedCommand = commandList.commandsOptionsResponse.find( (command) => command.name === receivedCommandName.name );
                // on exécute la fonction modalResponse de la commande associée
                await associatedCommand.modalResponse(interaction, modalData)
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