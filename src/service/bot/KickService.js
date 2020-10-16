const mongoose = require('../../config/mongoose');
const __ = require('colors');
const ModActions = require('../actions/ModActions');
const {
    mongo
} = require('mongoose');

async function kickUser(username, message) {
    console.log("Uh oh! 3 strikes! Kick service kicking the user!");

    const userToKick = await mongoose.StrikedUserModel.findOne({
        username: username
    });

    // Before creating a new instance, we need to check if one exists already.
    // If an instance already exists, add both lifetimeStrikes together and concat both .warnings arrays

    const possibleUser = await mongoose.KickedUserModel.findOne({
        username: username
    });
    if (possibleUser) {
        // Here is where we concat the arrays and add the lifetimeStrikes together...
        possibleUser.lifetimeStrikes += userToKick.lifetimeStrikes;
        possibleUser.warnings = possibleUser.warnings.concat(userToKick.warnings);

        await possibleUser.save();

    } else {
        const kickedUserInstance = new mongoose.KickedUserModel({
            warnings: userToKick.warnings,
            username: userToKick.username,
            strikeCount: userToKick.strikeCount,
            lifetimeStrikes: userToKick.lifetimeStrikes
        });
        await kickedUserInstance.save();
    }

    await mongoose.StrikedUserModel.deleteOne(userToKick);
    await removeUserFromGuild(username, message);

}

async function removeUserFromGuild(username, message) {
    await ModActions.kick(username, message);
}

async function listKicked() {
    const striked = await mongoose.getKickedAsync();
}

async function getKickedUser(username) {
    const foundUser = await mongoose.KickedUserModel.findOne({
        username: username
    });
    if (foundUser == null) {
        throw new Error("That user doesn't seem to be in the database!;");
    }
    return foundUser;

}

async function unkickUser(user) {
    await user.delete();
}


module.exports = {
    kickUser,
    listKicked,
    removeUserFromGuild,
    getKickedUser,
    unkickUser
}