const { Events } = require("discord.js")
module.exports = {
    config:{
        name: "messageCreate",
        enableEvents: true,
        canBeUsedOnDM: false
    },
    async execute(message){
        // TODO: analyse message and suppress if it contains a bad word (only if auto-mod is active in the guild)
    }
}