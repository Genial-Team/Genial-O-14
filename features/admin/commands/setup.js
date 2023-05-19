const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder,ButtonStyle,
    ButtonBuilder, ChannelType, PermissionFlagsBits
} = require("discord.js");
const canExecuteAdminCommand = require("../../../modules/canExecuteAdminCommand")

async function createGuildConfig(interaction, oldInteraction) {
    // crée le salon de logs
    interaction.guild.channels.create({
        name: "génial-logs",
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: discordClient.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            }]
    }).then((channel) => {
        // crée le rôle mute
        interaction.guild.roles.create({
            name: '🔇| Muted',
            color: '#000001',
            Permissions: [null],
            mentionable: false,
            hoist: false,
            position: 0,
            reason: 'Rôle servant à empêcher les gens de parler si ils sont mute par le bot',

        }).then((role) => {
            // crée le document dans la base de donnée
            dataBase.Guild.create({
                guildID: interaction.guildId,
                muteID: role.id,
                logChannel: channel.id
            }).then(() => {
                interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText ).forEach((channel) => {
                    channel.permissionOverwrites.edit(role.id, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false,
                        SendMessagesInThreads: false,
                        SendTTSMessages: false,
                        //SendVoiceMessages: false,
                        Stream: false,
                        UseSoundboard: false,
                        UseEmbeddedActivities: false,
                    })
                })
                interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).forEach((channel) => {
                    channel.permissionOverwrites.edit(role.id, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false,
                        SendMessagesInThreads: false,
                        SendTTSMessages: false,
                        //SendVoiceMessages: false,
                        Stream: false,
                        UseSoundboard: false,
                        UseEmbeddedActivities: false,
                    })
                })

                // envoie un message de confirmation dans le salon des logs
                interaction.guild.channels.fetch(channel.id).then(async (channel) => {
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("🛠️ | Configuration du serveur")
                                .setDescription("Votre serveur est maintenant configuré, vous pouvez désormais utiliser toutes les commandes du bot (de plus amples informations sont disponibles sur notre site internet)")
                                .addFields(
                                    {
                                        name: "🔇 | Mute",
                                        value: `le rôle permettant de mute les gens est maintenant créé, vous pouvez le trouver dans la liste des rôles sous le nom de ${interaction.guild.roles.cache.get(role.id)}`,
                                    },
                                    {
                                        name: "📝 | Logs",
                                        value: "c'est dans ce salon que vous allez retrouver toutes les actions effectuées par le bot"
                                    }
                                )
                                .setColor(colorScheme.default.success)
                                .setFooter({text: discordClient.user.username, iconURL: discordClient.user.avatarURL()})
                                .setTimestamp()

                        ]
                    })
                    await oldInteraction.deleteReply();
                    commandCache.del(`setup:interaction:${interaction.user.id}`)
                    return interaction.reply({
                        content: "Le serveur a été réinitialisé",
                        components: [],
                        ephemeral: true
                    })
                })
                //si le document n'a pas était créé, on envoie un message d'erreur
            }).catch(async (err) => {
                await oldInteraction.deleteReply();
                commandCache.del(`setup:interaction:${interaction.user.id}`)
                return interaction.reply({
                    content: error.fr.commandError.commonError,
                    components: [],
                    ephemeral: true
                })
            })
        })
    })
}

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

        if ( !canExecuteAdminCommand ) return interaction.reply({
            content: error.fr.permissions.dontHaveAdminPermission,
            ephemeral: true
        })

        //on stocke l'interaction dans le cache
        let interactionCache = {
            interaction: interaction,
            interactionToken: interaction.token,
            interactionWebhookClient: interaction.webhook.client,
            interactionWebhookToken: interaction.webhook.token
        }
        commandCache.set(`setup:interaction:${interaction.user.id}`, interactionCache);


        //import server config and chech error
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
            await interaction.reply({
                content: "Vous avez déjà configuré votre serveur, voulez-vous le réinitialiser ?",
                components: [actionRow],
                ephemeral: true
            })
        } else {
            await interaction.reply({ content: "Configuration du serveur en cours...", ephemeral: true })
            await createGuildConfig(interaction);

        }


    },
    buttonResponse: async function(interaction) {
        //import cache
        const fetchedCache = commandCache.get(`setup:interaction:${interaction.user.id}`);

        let oldInteraction = fetchedCache.interaction;
        oldInteraction.token = fetchedCache.interactionToken;
        oldInteraction.webhook.client = fetchedCache.interactionWebhookClient;
        oldInteraction.webhook.token = fetchedCache.interactionWebhookToken;

        // import server config and chech error
        const serverConfig = await getServerConfig(interaction.guild.id);
        if ( !serverConfig || !serverConfig.guildID ) return await createGuildConfig(interaction);
        // check if the confirm button is pressed

        switch ( interaction.customId ) {
            case "setup:reset:true":
                // on supprime le salon et le rôle mute precedent crée
                interaction.guild.channels.delete(serverConfig.logChannel, `Réinitialisation du serveur demandé par ${interaction.user.username}`)
                interaction.guild.roles.delete(serverConfig.muteID, `Réinitialisation du serveur demandé par ${interaction.user.username}`)
                // on supprime le document de la base de donnée
                await dataBase.Guild.findOneAndDelete({guildID: interaction.guildId})
                // on recrée la configuration du serveur avec les nouvelles données
                await createGuildConfig(interaction, oldInteraction)
                break;
            case "setup:reset:false":
                await oldInteraction.deleteReply();
                await interaction.reply({content: "La réinitialisation du serveur a été annulée", ephemeral: true})
                commandCache.del(`setup:interaction:${interaction.user.id}`)
                break;
        }
    }
}