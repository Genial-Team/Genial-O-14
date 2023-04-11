const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder} = require("discord.js");

module.exports = {
    config: {
        name: "suggestion",
        active: true,
        canBeUsedOnDM: false,
    },
    initCommand: () => {
      return new SlashCommandBuilder()
          .setName("suggestion")
          .setDescription("crée une suggestion visible par tous")
    },
    execute: async function(interaction) {


        const contentInputModal = new TextInputBuilder()
            .setCustomId(`${this.config.name}:content`)
            .setPlaceholder("ma superbe suggestion")
            .setLabel("contenu de ma suggestion")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const contentModal = new ModalBuilder()
            .setTitle("formulaire de suggestion")
            .setCustomId("suggestion:modal")

        contentModal.addComponents( new ActionRowBuilder().addComponents(contentInputModal) )
        await interaction.showModal(contentModal)


    },
    modalResponse: async function(interaction, modalData) {

        if ( !modalData.fields[0].value ) return interaction.reply({ content: error.fr.commandError.noArgumentFound, ephemeral: true })

        const embed = new EmbedBuilder()
            .setDescription(modalData.fields[0].value)
            .setAuthor({ name : interaction.user.tag, iconURL: interaction.member.displayAvatarURL() })
            .setColor(colorScheme.default.primary)
            .setTimestamp();

        interaction.reply({ embeds: [embed], fetchReply: true })
            .then( (message) => {
                message.react("👍")
                message.react("👎")
            } )
    }
}