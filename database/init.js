module.exports = () => {
    const mongoose = require("mongoose");
    const mongoLink = `mongodb://superadmin:quequinlynhe235@51.77.159.187:27017/genialo-dev?authMechanism=SCRAM-SHA-256&authSource=admin`


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
