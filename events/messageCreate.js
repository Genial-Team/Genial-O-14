const { Events } = require("discord.js")
module.exports = {
    config:{
        name: "messageCreate",
        enableEvents: true,
        canBeUsedOnDM: false
    },
    async execute(message){
        await message.react("✋")
    }
}