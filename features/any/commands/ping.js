const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    config: {
        name: "ping",
        active: true,
        canBeUsedOnDM: true,
    },
    initCommand: () => {
      return new SlashCommandBuilder()
          .setName("ping")
          .setDescription("differed reply")
    },
    execute: async function(interaction) {
        await interaction.deferReply()

        return interaction.editReply({ content: `pong !` })
    }
}