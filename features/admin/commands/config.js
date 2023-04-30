const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder,ButtonStyle,
    ButtonBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} = require("discord.js");
const getServerConfig = require("../../../modules/getServerConfig");
const formatWelcomeText = require("../../../modules/formatWelcomeText")
module.exports = {
    config: {
        name: "config",
        active: true,
        canBeUsedOnDM: false,
    },
    initCommand: () => {
      return new SlashCommandBuilder()
          .setName("config")
          .setDescription("🛠️ | configure les journaux que le Bot enverra")
    },
    execute: async function(interaction) {
        const serverConfig = await getServerConfig(interaction.guild.id);

        const guildData = {
            logChannel: serverConfig ? serverConfig.logChannel : "non configuré",
            welcomeMessageText: serverConfig ? serverConfig.welcomeText : "non configuré",
            logMessage : serverConfig ? serverConfig.syslog.messageDelete :"non configuré",
            banAdd : serverConfig ? serverConfig.syslog.banAdd : "non configuré",
            banRemove : serverConfig ? serverConfig.syslog.banRemove : "non configuré",
        }


        if ( !serverConfig || !serverConfig.guildID) {

        }

        const configurationEmbed = new EmbedBuilder()
            .setTitle(`🛠️ | configuration des journaux`)
            .setFields(
                {
                    name: "📝 | salon de log & rôle muet",
                    value: guildData.logChannel ? `${await interaction.guild.channels.fetch(guildData.logChannel)} & ${await interaction.guild.roles.fetch(serverConfig.muteID)}` : "non configuré"
                },
                {
                    name: ":wave:  | message de bienvenue",
                    value: formatWelcomeText(guildData.welcomeMessageText, interaction.member)
                },
                {
                    name: ":pencil: | message supprimé",
                    value: guildData.logMessage ? "✅prêt" : "⛔non configuré"
                },
                {
                    name: ":no_entry_sign: | ban enregistré",
                    value: guildData.banAdd ? "✅prêt" : "⛔non configuré"
                },
                {
                    name: ":arrows_counterclockwise: | ban révoqué",
                    value: guildData.banRemove ? "✅prêt" : "⛔non configuré"
                }
            )
            .setColor(colorScheme.default.info)
            .setFooter({text: interaction.member.user.username, iconURL: interaction.member.avatarURL()})

        const navigationSelect = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('config:navbar:'+ interaction.guild.id)
                    .setPlaceholder('que veux-tu configurer ?')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('historique des messages')
                            .setDescription('les messages supprimés pourront être sauvegardés')
                            .setValue('messageDelete'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("le message d'accueil")
                            .setDescription("un message sera envoyé pour l'accueillir le membre")
                            .setValue('welcomeText'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('les bans créent/révoqué')
                            .setDescription('les bans / débans serons sauvegarder par le bot')
                            .setValue('bans'),
                    )
            );

        await interaction.reply({
            ephemeral: true,
            embeds: [configurationEmbed],
            components: [navigationSelect]
        })

    },
    async buttonResponse(interaction) {
        const serverConfig = await getServerConfig(interaction.guild.id);

        if ( !serverConfig ) return interaction.reply({content: error.fr.configError.serverMustBeConfigured, ephemeral: true})

        switch (interaction.values[0]) {
            case "messageDelete":

                await dataBase.Guild.findOneAndUpdate({guildID: interaction.guild.id}, {
                    $set: {
                        syslog: {
                            messageDelete: !serverConfig.syslog.messageDelete,
                            banAdd: serverConfig.syslog.banAdd,
                            banRemove: serverConfig.syslog.banRemove,
                        }
                    }
                })

                await interaction.guild.channels.fetch(serverConfig.logChannel).send({
                    embeds:[
                        new EmbedBuilder()
                            .setColor(colorScheme.default.info)
                            .setFooter({text: interaction.member.user.username, iconURL: interaction.member.avatarURL()})
                            .setDescription(`${interaction.member} a **${ !serverConfig.syslog.messageDelete ? "activé" : "désactivé" }** la sauvegarde des messages supprimé`)
                    ]
                })

                interaction.reply({
                    content: `les messages supprimé ${
                        !serverConfig.syslog.messageDelete
                            ? `serons sauvegardé dans ${await interaction.guild.channels.fetch(serverConfig.logChannel)}`
                            : `ne serons plus sauvegardé`
                    }`,
                    ephemeral: true
                })
                break;
            case "welcomeText":
                interaction.reply({
                    content: "welcome text",
                    ephemeral: true
                })
                break;
            case "bans":
                interaction.reply({
                    content: "bans",
                    ephemeral: true
                })
                break;
            default:
                console.log(interaction.value)
                interaction.reply({
                    content: error.fr.commandError.noArgumentFound,
                    ephemeral: true
                })
                break;
        }
    }
}