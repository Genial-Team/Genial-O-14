const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    config: {
        name: "hello",
        active: true,
        canBeUsedOnDM: false,
    },
    initCommand: () => {
      return new SlashCommandBuilder()
          .setName("hello")
          .setDescription("aucune idée :/")
    },
    execute: async function(interaction) {

        return interaction.reply({ content: `bonjour ${interaction.member} !` })
    }
}