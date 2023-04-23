const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder,ButtonStyle,
    ButtonBuilder, ChannelType, PermissionFlagsBits
} = require("discord.js");

async function createGuildConfig(interaction) {
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
                // envoie un message de confirmation dans le salon des logs
                interaction.guild.channels.fetch(channel.id).then((channel) => {
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
                    return interaction.editReply({content: "Le serveur a été réinitialisé", components: [], ephemeral: true})
                })
                //si le document n'a pas était créé, on envoie un message d'erreur
            }).catch((err) => {
                return interaction.editReply({
                    content: error.fr.commandError.commonError,
                    components: [],
                    ephemeral: true
                })
            })
        })
    })


    /**
     * edit all channels permissions to deny send messages for mute role
     */
    // interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).forEach((channel) => {
    //     channel.permissionOverwrites.edit(muteID, {
    //         SEND_MESSAGES: false,
    //         ADD_REACTIONS: false,
    //         SPEAK: false,
    //         SEND_MESSAGES_IN_THREADS: false,
    //         SEND_TTS_MESSAGES: false,
    //         STREAM: false,
    //         USE_SOUNDBOARD: false,
    //         USE_EMBEDDED_ACTIVITIES: false,
    //     })
    // })

    /**
     * create a new server config
     */

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
            console.log(interaction)
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

        // delete the original message
        console.log(interaction)
        await interaction.reply({content: "Réinitialisation du serveur en cours...", components: [], ephemeral: true});
        // import server config and chech error
        const serverConfig = await getServerConfig(interaction.guild.id);
        if ( !serverConfig || !serverConfig.guildID ) return await createGuildConfig(interaction);
        // check if the confirm button is pressed
        if ( interaction.customId === "setup:reset:true" ) {
            // on supprime le salon et le rôle mute precedent crée
            interaction.guild.channels.delete(serverConfig.logChannel, `Réinitialisation du serveur demandé par ${interaction.user.username}`)
            interaction.guild.roles.delete(serverConfig.muteID, `Réinitialisation du serveur demandé par ${interaction.user.username}`)
            // on supprime le document de la base de donnée
            await dataBase.Guild.findOneAndDelete({guildID: interaction.guildId})
            // on recrée la configuration du serveur avec les nouvelles données
            await createGuildConfig(interaction)

        }
    }
}