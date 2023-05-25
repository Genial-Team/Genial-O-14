const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder,ButtonStyle,
    ButtonBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ChannelSelectMenuBuilder
} = require("discord.js");

const getServerConfig = require("../../../modules/getServerConfig");
const formatWelcomeText = require("../../../modules/formatWelcomeText");
const sendAlertToLogChannel = require("../../../modules/sendAlertToLogChannel");
const canExecuteAdminCommand = require("../../../modules/canExecuteAdminCommand");

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

        if ( !canExecuteAdminCommand ) return interaction.reply({
            content: error.fr.permissions.dontHaveAdminPermission,
            ephemeral: true
        })

        const serverConfig = await getServerConfig(interaction.guild.id);

        const guildData = {
            logChannel: serverConfig ? serverConfig.logChannel : "non configuré",
            welcomeMessageText: serverConfig ? serverConfig.welcomeText : "non configuré",
            logMessage : serverConfig ? serverConfig.syslog.messageDelete :"non configuré",
            banAdd : serverConfig ? serverConfig.syslog.banAdd : "non configuré",
            banRemove : serverConfig ? serverConfig.syslog.banRemove : "non configuré",
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
                            .setLabel("le salon du message d'accueil")
                            .setDescription("un message sera envoyé pour l'accueillir le membre")
                            .setValue('welcomeChannel'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("le contenu du message d'accueil")
                            .setDescription("le contenu du message d'accueil")
                            .setValue("welcomeMessage"),
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

        if ( !serverConfig ) return interaction.update({
            content: error.fr.configError.serverMustBeConfigured,
            embeds:[],
            components:[],
            ephemeral: true
        })


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

                        interaction.update({
                            content: `les messages supprimé ${
                                !serverConfig.syslog.messageDelete
                                    ? `serons sauvegardé dans ${await interaction.guild.channels.fetch(serverConfig.logChannel)}`
                                    : `ne serons plus sauvegardé`
                            }`,
                            embeds:[],
                            components:[],
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

                            await sendAlertToLogChannel(
                                `le message d'accueil a été désactivé par ${interaction.member}`,
                                interaction,
                                serverConfig.logChannel
                            )

                            interaction.update({
                                content: "le message d'accueil à été désactivé",
                                embeds:[],
                                components: [],
                                ephemeral: true
                            })

                        } else {
                            const navigationSelect = new ActionRowBuilder()
                                .addComponents(
                                    new ChannelSelectMenuBuilder()
                                        .setPlaceholder("où devrais-je envoyer le message ?")
                                        .setCustomId('config:welcomeChannel:select')
                                        .setChannelTypes(ChannelType.GuildText)
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                )

                            interaction.update({
                                content: "sélectionne le salon où je devrais envoyer le message d'accueil parmi la liste ci-dessous",
                                embeds:[],
                                components: [navigationSelect],
                                ephemeral: true
                            })
                        }
                        break;
                    case "welcomeMessage":
                        /**
                         *             .replaceAll("{guild.count}", member.guild.memberCount)
                         * @type {EmbedBuilder}
                         */
                        const exempleEmbed = new EmbedBuilder()
                            .setTitle("option et règle du message d'accueil")
                            .setDescription("votre message ne doit pas contenir plus de 1024 caractères, mais vous trouverai ci-dessous des option pour formater votre texte")
                            .addFields({
                                name:"{mention}",
                                value: `mentionne le nouveau membre là ou vous le souhaitez (exemple: ${interaction.member})`
                            },{
                                name:"{server}",
                                value: `intègre le nom du server là ou vous le souhaitez (exemple: ${interaction.guild.name})`
                            },{
                                name:"{pseudo}",
                                value: `intègre le nom du nouveau membre là ou vous le souhaitez (exemple: ${interaction.member.user.username})`
                            },{
                                name: "{compteur}",
                                value: `intègre le nombre de membre sur le serveur là ou vous le souhaitez (exemple: ${interaction.guild.memberCount})`
                            })
                            .setColor(colorScheme.default.info)
                            .setFooter({text: interaction.member.user.username, iconURL: interaction.member.avatarURL()})

                        const actionRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("config:welcomeMessage:true")
                                    .setLabel("Oui, je souhaite continuer")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("config:welcomeMessage:false")
                                    .setLabel("Non, je ne souhaite pas continuer")
                                    .setStyle(ButtonStyle.Danger)
                            )

                        interaction.update({
                            content: "",
                            embeds: [exempleEmbed],
                            components: [actionRow],
                            ephemeral: true,
                        })

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

                        interaction.update({
                            content: `les notifications de bannissement / annulation de bannissement ${
                                !serverConfig.syslog.banAdd
                                    ? `serons envoyé dans ${await interaction.guild.channels.fetch(serverConfig.logChannel)}`
                                    : `ne serons plus envoyé`
                            }`,
                            embeds:[],
                            components:[],
                            ephemeral: true
                        })
                        break;
                    default:
                        console.log(interaction.value)
                        interaction.update({
                            content: error.fr.commandError.noArgumentFound,
                            embeds:[],
                            components:[],
                            ephemeral: true
                        })
                        break;
                }
                break;
            case "config:welcomeMessage:true":
                const contentInputModal = new TextInputBuilder()
                    .setCustomId(`config:welcomeMessage:content`)
                    .setPlaceholder("Bienvenue à toi {mention}")
                    .setLabel("contenu du message")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph);

                const contentModal = new ModalBuilder()
                    .setTitle("message de bienvenue")
                    .setCustomId("config:welcomeMessage:modal")

                contentModal.addComponents( new ActionRowBuilder().addComponents(contentInputModal) )

                await interaction.showModal(contentModal)
                break;
            case "config:welcomeMessage:false":
                interaction.update({
                    content: "modification annulé",
                    embeds:[],
                    components:[],
                    ephemeral: true,
                })
                break;
            case "config:welcomeChannel:select":

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
                /**
                 * TODO: terminé de supprimé le message temporaire
                 */

                await interaction.update({
                    content: `le message d'accueil a été activé et le salon d'envoi a été défini sur ${await interaction.guild.channels.fetch(newWelcomeChannelId) }`,
                    embeds:[],
                    components:[],
                    ephemeral: true
                })
                break;
        }


    },
    modalResponse: async function(interaction, modalData) {

        if ( !modalData.fields[0].value ) return interaction.reply({ content: error.fr.commandError.noArgumentFound, ephemeral: true });
        const serverConfig = await getServerConfig(interaction.guild.id);


        const embed = new EmbedBuilder()
            .setTitle("confirmation de mise à jours du message d'accueil")
            .addFields({
                name:"le message de bienvenue à été definis sur",
                value: modalData.fields[0].value.toString()
            })
            .setColor(colorScheme.default.success)
            .setFooter({text: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()})
            .setTimestamp();

        await dataBase.Guild.findOneAndUpdate({guildID: interaction.guild.id}, {
            $set: {
                welcomeText: modalData.fields[0].value
            }
        })

        await sendAlertToLogChannel(
            `${interaction.member} à remplacer le message de bienvenue par \n ${modalData.fields[0].value} `,
            interaction,
            serverConfig.logChannel
        )

        interaction.update({ embeds: [embed], components: [], ephemeral: true })
    }
}