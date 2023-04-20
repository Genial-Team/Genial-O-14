const connectToDatabase = require("../database/init")
module.exports = {
    config:{
        name: "ready",
        enableEvents: true,
        canBeUsedOnDM: false
    },
    async execute(client){
        console.log(colors.green(`connecté en tant que ${colors.blue(client.user.tag)}`))

        connectToDatabase()
        client.user.setPresence({
            activities: [{
                name: `ses ${client.guilds.cache.size || "undefined"} serveurs`,
                type: 2
            }],
            status: "dnd" // "online
        })
    }
}