const mongo = require('mongoose')

const schema2 = new mongo.Schema({

    guildID:{
        type:String,
        default:null
    },
    textChannelID:{
        type: String,
        default: null
    },
    voiceChannelID:{
        type: String,
        default: null

    },
    channelOwner:{
        type: String,
        default: null
    }

})

module.exports = mongo.model( 'PrivateChannel', schema2 )