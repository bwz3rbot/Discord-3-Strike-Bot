const mongoose = require('mongoose');
const __ = require('colors');

async function connect() {
    await mongoose.connect('mongodb://localhost/userdata', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}


let db = mongoose.connection
db.on('error', function (err) {
    console.log('connection error:', err);
    console.log("I don't think the database is running!".red);
    process.exit();
});


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    warnings: Array,
    strikeCount: Number,
    lifetimeStrikes: Number
});

const StrikedUserModel = mongoose.model("Strike", UserSchema);
const KickedUserModel = mongoose.model("Kick", UserSchema);

async function getKickedAsync(username) {
    return new Promise(function (resolve, reject) {
        KickedUserModel.find({}, function (err, user) {
            if (err !== null) reject(err);
            else resolve(user);
        });
    });
}
async function getStrikedAsync(username) {
    return new Promise(function (resolve, reject) {
        StrikedUserModel.find({}, function (err, user) {
            if (err !== null) reject(err);
            else resolve(user);
        });
    });
}

module.exports = {
    db,
    connect,
    StrikedUserModel,
    KickedUserModel,
    getKickedAsync,
    getStrikedAsync
}