module.exports = () => {
    const mongoose = require("mongoose");
    const mongoLink = `mongodb://${process.env.DataBaseUser}:${process.env.DataBasePass}@${process.env.DataBaseIp}/${process.env.DataBaseName}?${process.env.DataBaseOptions}`


    mongoose.connect(mongoLink)
        .then( (db) =>{
            console.log( colors.green(`[DB] connected to database ${colors.yellow(db.connections[0].name)}`) )
            return db;
        })
        .catch( (err) =>{
            console.log( colors.red(`[DB] an internal error has occurred: "${err.message}"`) )
            return err;
        } )

}
