const mongoose = require('mongoose');

mongoose.set('strictQuery', true)



const connect_db = () => {
    return mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("DB CONNECTED");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connect_db
