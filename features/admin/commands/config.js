const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder,ButtonStyle,
    ButtonBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ChannelSelectMenuBuilder
} = require("discord.js");
const getServerConfig = require("../../../modules/getServerConfig");
const formatWelcomeText = require("../../../modules/formatWelcomeText");
const sendAlertToLogChannel = require("../../../modules/sendAlertToLogChannel");
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
                    value: guildData.logMessage ? "prêt" : "non configuré / désactivé"
                },
                {
                    name: ":no_entry_sign: | ban enregistré",
                    value: guildData.banAdd ? "prêt" : "non configuré / désactivé"
                },
                {
                    name: ":arrows_counterclockwise: | ban révoqué",
                    value: guildData.banRemove ? "prêt" : "non configuré / désactivé"
                }
            )
            .setColor(colorScheme.default.info)
            .setFooter({text: interaction.member.user.username, iconURL: interaction.member.avatarURL()})

        const navigationSelect = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('config:navbar')
                    .setPlaceholder('que veux-tu configurer ?')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('historique des messages')
                            .setDescription('les messages supprimés pourront être sauvegardés')
                            .setValue('messageDelete'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("le message d'accueil")
                            .setDescription("un message sera envoyé pour l'accueillir le membre")
                            .setValue('welcomeChannel'),
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

        console.log(interaction)



        switch (interaction.customId) {
            case "config:navbar" :

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

                        await sendAlertToLogChannel(
                            `la sauvegarde des messages supprimés a été ${!serverConfig.syslog.messageDelete ? "activé" : "désactivé"} par ${interaction.member}`,
                            interaction,
                            serverConfig.logChannel
                        )

                        interaction.reply({
                            content: `les messages supprimé ${
                                !serverConfig.syslog.messageDelete
                                    ? `serons sauvegardé dans ${await interaction.guild.channels.fetch(serverConfig.logChannel)}`
                                    : `ne serons plus sauvegardé`
                            }`,
                            ephemeral: true
                        })
                        break;
                    case "welcomeChannel":

                        if ( serverConfig.wChannel ) {
                            await dataBase.Guild.findOneAndUpdate({guildID: interaction.guild.id}, {
                                $set: {
                                    wChannel: null
                                }
                            })
                            interaction.reply({
                                content: "le message d'accueil à été désactivé",
                                ephemeral: true
                            })
                        } else {
                            const navigationSelect = new ActionRowBuilder()
                                .addComponents(
                                    new ChannelSelectMenuBuilder()
                                        .setPlaceholder("où devrais-je envoyer le message ?")
                                        .setCustomId('config:welcomeChannel')
                                        .setChannelTypes(ChannelType.GuildText)
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                )

                            interaction.reply({
                                content: "sélectionne le salon où je devrais envoyer le message d'accueil parmi la liste ci-dessous",
                                components: [navigationSelect],
                                ephemeral: true
                            })
                        }


                        break;
                    case "bans":

                        await dataBase.Guild.findOneAndUpdate({guildID: interaction.guild.id}, {
                            $set: {
                                syslog: {
                                    messageDelete: serverConfig.syslog.messageDelete,
                                    banAdd: !serverConfig.syslog.banAdd,
                                    banRemove: !serverConfig.syslog.banRemove,
                                }
                            }
                        })

                        await sendAlertToLogChannel(
                            `les notifications de bannissement / annulation de bannissement ont été ${!serverConfig.syslog.banAdd ? "activé" : "désactivé"} par ${interaction.member}`,
                            interaction,
                            serverConfig.logChannel
                        )

                        interaction.reply({
                            content: `les notifications de bannissement / annulation de bannissement ${
                                !serverConfig.syslog.messageDelete
                                    ? `serons envoyé dans ${await interaction.guild.channels.fetch(serverConfig.logChannel)}`
                                    : `ne serons plus envoyé`
                            }`,
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

                break;
            case "config:welcomeChannel":

                /**
                 * TODO: finir le message d'accueil au complet
                 */
                const newWelcomeChannelId = interaction.values[0];

                await dataBase.Guild.findOneAndUpdate({guildID: interaction.guild.id}, {
                    $set: {
                        wChannel: newWelcomeChannelId.toString()
                    }
                })

                await sendAlertToLogChannel(
                    `le message d'accueil a été activé et le salon d'envoi a été défini sur ${await interaction.guild.channels.fetch(newWelcomeChannelId) } par ${interaction.member}`,
                    interaction,
                    serverConfig.logChannel
                )

                interaction.reply({
                    content: `le message d'accueil a été activé et le salon d'envoi a été défini sur ${await interaction.guild.channels.fetch(newWelcomeChannelId) }`,
                    ephemeral: true
                })

                break;
        }


    }
}