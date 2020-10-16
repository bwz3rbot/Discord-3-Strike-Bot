const mongoose = require('../../config/mongoose');
const __ = require('colors');
const ModActions = require('../actions/ModActions');
const {
    mongo
} = require('mongoose');

async function kickUser(username, message) {
    console.log("Uh oh! 3 strikes! Kick service kicking the user!");
    console.log("Kicking this username: ", username);

    const userToKick = await mongoose.StrikedUserModel.findOne({
        username: username
    });
    console.log("Found this user to kick: ", userToKick);

    // Before creating a new instance, we need to check if one exists already.
    // If an instance already exists, add both lifetimeStrikes together and concat both .warnings arrays

    const possibleUser = await mongoose.KickedUserModel.findOne({
        username: username
    });
    if (possibleUser) {
        console.log("User was already kicked. Adding them together...");
        // Here is where we concat the arrays and add the lifetimeStrikes together...
        possibleUser.lifetimeStrikes += userToKick.lifetimeStrikes;
        possibleUser.warnings = possibleUser.warnings.concat(userToKick.warnings);
        console.log("Saving this user: ", possibleUser);
        await possibleUser.save();

    } else {
        console.log("User has never been kicked before. Creating a new instance of KickedUserModel...");
        const kickedUserInstance = new mongoose.KickedUserModel({
            warnings: userToKick.warnings,
            username: userToKick.username,
            strikeCount: userToKick.strikeCount,
            lifetimeStrikes: userToKick.lifetimeStrikes
        });

        console.log("The generated Instance: ", kickedUserInstance);
        console.log("Saving the instance...")
        await kickedUserInstance.save();
    }

    console.log("Deleting the userToKick from StrikedUserModel");
    await mongoose.StrikedUserModel.deleteOne(userToKick);
    console.log("Finished with the database. Now removing the user from the guild...");
    await removeUserFromGuild(username, message);

}

async function removeUserFromGuild(username, message) {
    console.log(`Kick service asking ModActions to remove user ${username} form the guild!`);
    await ModActions.kick(username, message);
}

async function listKicked() {
    console.log("LISTING KICKED:");
    const striked = await mongoose.getKickedAsync();
}

async function getKickedUser(username) {
    console.log("KickService searching for kicked user: ", username);

    const foundUser = await mongoose.KickedUserModel.findOne({
        username: username
    });

    console.log("Found this user: ", foundUser);
    if (foundUser == null) {
        throw new Error("That user doesn't seem to be in the database!;");
    }
    return foundUser;

}

async function unkickUser(user) {
    console.log("KickService deleting user: ", user);
    await user.delete();
}


module.exports = {
    kickUser,
    listKicked,
    removeUserFromGuild,
    getKickedUser,
    unkickUser
}