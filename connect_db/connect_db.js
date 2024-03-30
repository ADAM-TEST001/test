const mongoose = require('mongoose');

mongoose.set('strictQuery', true)


const connect_db = () => {
    return mongoose.connect("mongodb+srv://abc:abc@test.scjs2vl.mongodb.net/?retryWrites=true&w=majority&appName=TEST").then(() => {
        console.log("DB CONNECTED");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connect_db
