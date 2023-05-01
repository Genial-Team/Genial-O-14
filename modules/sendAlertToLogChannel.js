const {EmbedBuilder} = require("discord.js");
module.exports = async function formatWelcomeText(
    embedDescription= "",
    interaction,
    logChannelID
) {

    const logChannel = await interaction.guild.channels.fetch(logChannelID.toString());

    logChannel
        ? logChannel.send({
            embeds:[
                new EmbedBuilder()
                    .setTitle(`🔔 | notification`)
                    .setDescription(embedDescription.toString())
                    .setColor(colorScheme.default.warning)
                    .setFooter({text: interaction.member.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.avatar}.png`})

            ]
        })
        : console.log("unable to detect log channel")

    return null;

}