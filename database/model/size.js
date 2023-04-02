const mongo6 = require('mongoose')

const schema5 = new mongo6.Schema({

    modelID: {
        type: String,
        default: null
    },
    BotServerSize: {
        type: String,
        default: null
    },
})

module.exports = mongo6.model( 'Serversize', schema5 )
