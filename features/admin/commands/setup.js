const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder,ButtonStyle,
    ButtonBuilder
} = require("discord.js");
const getServerConfig = require("../../../modules/getServerConfig.js");
module.exports = {
    config: {
        name: "setup",
        active: true,
        canBeUsedOnDM: false,
    },
    initCommand: () => {
      return new SlashCommandBuilder()
          .setName("setup")
          .setDescription("🛠️ | configure votre serveur")
    },
    execute: async function(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const serverConfig = await getServerConfig(interaction.guild.id);

        if ( serverConfig && serverConfig.guildID ) {
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("setup:reset:true")
                        .setLabel("Oui")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("setup:reset:false")
                        .setLabel("Non")
                        .setStyle(ButtonStyle.Danger)
                )
            return await interaction.editReply({ content: "Vous avez déjà configuré votre serveur, voulez-vous le réinitialiser ?", components: [actionRow] })
        } else {
            return await interaction.editReply({ content: "Veuillez patienter...", ephemeral: true })
        }


    },
    buttonResponse: async function(interaction) {
        const serverConfig = getServerConfig(interaction.guild.id);
        if ( !serverConfig ) return interaction.editReply({ content: "Une erreur s'est produite, veuillez réessayer", ephemeral: true });
        if ( interaction.customId === "setup:reset:true" ) {
            console.log(interaction)
            await interaction.update({ content: "Veuillez patienter...", components: [] })
            await dataBase.Guild.deleteOne({ guildID: interaction.guildId });
            await dataBase.Guild.create({
                guildID: interaction.guildId,
            }).then( () => {{
                interaction.editReply({ content: "Le serveur a été réinitialisé", components: [], ephemeral: true })
            }}).catch( (err) => {
                interaction.editReply({ content: "Une erreur s'est produite, veuillez réessayer", components: [], ephemeral: true })
                console.log(err)
            })
        }
    }
}