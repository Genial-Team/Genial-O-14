const { PermissionsBitField } = require("discord.js")
module.exports = (interaction) => {
    return interaction.member.permissions.has(PermissionsBitField.Flags.Administrator )
}