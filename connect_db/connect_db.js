const mongoose = require('mongoose');

mongoose.set('strictQuery', true)


const connect_db = () => {
    return mongoose.connect('mongodb+srv://vercel-admin-user:SH.B"cT92Nrz"*u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=TEST').then(() => {
        console.log("DB CONNECTED");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connect_db
