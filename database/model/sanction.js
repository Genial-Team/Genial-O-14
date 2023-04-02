const mongo3 = require('mongoose')

const schema3 = new mongo3.Schema({

    guildID: {
        type: String,
        default: null
    },
    userWarned:{
        type: String,
        default: null
    },
    sanction:{
        type: Array,
        default: []
    },



})

module.exports = mongo3.model( 'Sanction', schema3 )
