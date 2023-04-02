const mongo = require('mongoose')

const schema1 = new mongo.Schema({

    guildID:{
        type:String,
        default:null
    },
    messageDelete:{
        type: [String],
        default: null
    },
    ticketMember:{
        type: [String],
        default: null
    },
    ticketRole:{
        type: [String],
        default: null
    }

})

module.exports = mongo.model( 'Blacklist', schema1 )