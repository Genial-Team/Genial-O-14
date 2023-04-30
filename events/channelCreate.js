const { Events, ChannelType } = require("discord.js")
const getServerConfig = require("../modules/getServerConfig");
module.exports = {
    config:{
        name: Events.ChannelCreate,
        enableEvents: true,
        canBeUsedOnDM: false
    },
    async execute(channel){
        const serverConfig = await getServerConfig(channel.guild.id);

        if ( channel.type === ChannelType.GuildText || ChannelType.GuildVoice && ( serverConfig && serverConfig.guildID ) ) {
            await channel.permissionOverwrites.edit( serverConfig.muteID , {
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
        }
    }
}