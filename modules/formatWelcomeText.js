module.exports = function formatWelcomeText(text, member) {

    return text
        .replaceAll("{member}", member)
        .replaceAll("{guild.name}", member.guild.name)
        .replaceAll("{memberTag}", member.user.tag)
        .replaceAll("{username}", member.user.username)
        .replaceAll("{guild}", member.guild.name)
        .replaceAll("{guild.count}", member.guild.memberCount)
}