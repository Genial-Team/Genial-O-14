const mongoose = require('mongoose');

module.exports = async function getServerConfig(GuildID) {

    const data = await dataBase.Guild.findOne({guildID: GuildID}).exec();

    return data._doc ? data._doc : null;
}