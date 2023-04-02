const { Schema, model } = require('mongoose')

const schema = new Schema({

    guildID: {
        type: String,
        default: null
    },
    muteID: {
        type: String,
        default: null
    },
    wChannel:{
        type: String,
        default: null
    },
    logChannel:{
        type: String,
        default: null
    },
    welcomeText:{
        type: String,
        default: "Bienvenue {member}({username}) sur **{guild}**, nous somme donc __{guild.count}__ sur le serveur",
    },
    syslog:{
       messageDelete:{
           type: Boolean,
           default: false
       },
        banAdd:{
            type: Boolean,
            default: false
        },
        banRemove:{
           type: Boolean,
           default: false
        }
    },
})

module.exports = model( 'Guild', schema )
