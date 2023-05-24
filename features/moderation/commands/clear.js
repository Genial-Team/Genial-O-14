const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const getServerConfig = require("../../../modules/getServerConfig");
const sendAlertToLogChannel = require("../../../modules/sendAlertToLogChannel");

module.exports = {
    config: {
        name: "clear",
        active: true,
        canBeUsedOnDM: false,
    },
    initCommand: () => {
        return new SlashCommandBuilder()
            .setName("clear")
            .setDescription("🧹 | supprime un nombre définis de message")
            .addNumberOption(option => {
                return option
                    .setName("message")
                    .setDescription("le nombre de message à supprimé (les messages de plus de 14 jours ne peuvent pas être supprimé)")
                    .setMinValue(1)
                    .setMaxValue(100)
                    .setRequired(true)
            })
    },
    execute: async function (interaction) {
        const desiredNumber = interaction.options.getNumber("message");
        const serverConfig = await getServerConfig(interaction.guild.id);

        if ( !interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ) return interaction.reply({
            content: error.fr.permissions.dontHaveManageMessagePermission,
            ephemeral: true,
        })

        interaction.channel.bulkDelete(desiredNumber)
            .then( async (result) => {
                const deletedMessageNumber = result.size

                if (deletedMessageNumber === 0) return interaction.reply({content: "Aucun message n'a pu être supprimé", ephemeral: true})
                if ( serverConfig ) await sendAlertToLogChannel(
                    `${deletedMessageNumber} messages ont été supprimés du channel ${interaction.channel} par ${interaction.member}`,
                    interaction,
                    serverConfig.logChannel
                )

                interaction.reply({
                    content: `${deletedMessageNumber} messages ont correctement été supprimés`,
                    ephemeral: true
                })
            } )
            .catch( (err)=>{
                console.log(err)
            } )
    },
    buttonResponse: async function (interaction) {
        // responde to button / selecMenu
    },
    modalResponse: async function (interaction, modalData) {
        // response to modal
    },
}