const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
module.exports = {
    config: {
        name: "whois",
        active: true,
        canBeUsedOnDM: true,
    },
    initCommand: () => {
      return new SlashCommandBuilder()
          .setName("whois")
          .setDescription("📰 | donne des informations sur un utilisateur ")
          .addUserOption(option =>
              option.setName("membre")
                  .setDescription("👤 | le membre dont vous voulez voir les informations")
                .setRequired(true))
    },
    execute: async function(interaction) {
        await interaction.deferReply({ ephemeral: true})
        const fetchedMember = interaction.options.getMember("membre");

        if ( !interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames) ) return interaction.editReply({
            content: error.fr.permissions.dontHaveManageNicknamePermission,
            ephemeral: true,
        })

        function getMemberRoles () {
            if ( fetchedMember.roles.cache.size === 1 ) return "aucun rôle";
            const roleTable = [];
            fetchedMember.roles.cache.map( (roles) => {
                if ( roles.name !== "@everyone" ) return roleTable.push( `<@&${roles.id}>`);
            })
            return roleTable.length === 0 ? "aucun rôle" : roleTable.join("\n");
        }
        function formatDate(date) {
            return new Intl.DateTimeFormat('fr-FR').format(date)
        }

        const embed = new EmbedBuilder()
            .setTitle(`📰 | Informations sur ${fetchedMember.user.tag}`)
            .setThumbnail(fetchedMember.user.displayAvatarURL())
            .addFields(
                { name: "👤 | Pseudo", value: fetchedMember.user.tag, inline: true },
                 { name: "🆔 | ID", value: fetchedMember.user.id, inline: true },
                 { name: "📅 | Date de création du compte", value: formatDate(fetchedMember.user.createdAt), inline: true },
                { name: "📅 | Date d'arrivée sur le serveur", value: formatDate(fetchedMember.joinedAt), inline: true },
                { name: "👑 | Rôle le plus haut", value: `<@&${fetchedMember.roles.highest.id}>`, inline: true },
                { name: "📜 | Rôles", value: getMemberRoles(), inline: true },
                { name: "🤖 | robot", value: fetchedMember.user.bot ? "oui" : "non", inline: true }
            )
            .setAuthor({ name : interaction.user.tag, iconURL: interaction.member.displayAvatarURL() })
            .setColor(colorScheme.default.primary)
            .setTimestamp();

        return interaction.editReply({ embeds: [embed]})
    }
}