const mongoose = require('../../config/mongoose');
const dateformat = require('dateformat');
const KickService = require('./KickService');
const EmbedBuilder = require('../../common/util/EmbedBuilder');
const {
    KickedUserModel
} = require('../../config/mongoose');
const {
    mongo
} = require('mongoose');

class Warning {
    constructor(reason) {
        console.log("Constructing a new Warning Object!");
        this.time = dateformat(new Date());
        console.log("Constructed At: ", this.time);
        this.reason = reason
    }
}

class User {
    constructor(username) {
        this.username = username
        this.warnings = []
        this.strikeCount = 0
        this.lifetimeStrikes = 0
    }
    addWarning(reason) {
        const warning = new Warning(reason);
        this.warnings.push(warning);
        this.strikeCount++;
        this.lifetimeStrikes++;
        return this;
    }
}

async function checkUserExistsWithinGuild(username, message) {
    let formattedUserId = username.replace("<@!", "");
    formattedUserId = formattedUserId.replace(">", "");
    formattedUserId = formattedUserId.trim();
    const members = message.guild.members
    const userFound = members.cache.find(member => member.user.id === formattedUserId);
    if (!userFound) {
        throw new Error("That user isn't in the guild!;");
    }
}

// [Warn User Command]
async function warnUser(username, reason, message) {
    await checkUserExistsWithinGuild(username, message);
    console.log("warning user: ", username);
    // First check if user exists witin the database
    let user = await mongoose.StrikedUserModel.findOne({
        username: username
    });

    // If user does not exist, create a new user object

    if (user == null) {
        console.log("User was not found within the database. Creating new user.");
        // Give a warning
        const newUser = new User(username).addWarning(reason);
        const strikedUserInstance = new mongoose.StrikedUserModel(newUser);
        // Save it to the database
        await strikedUserInstance.save(newUser);
    } else {
        // If user exists in database, push a new warning with reason
        user.warnings.push(new Warning(reason));
        // Then increment the strike count
        user.strikeCount++;
        user.lifetimeStrikes++;
        // Save the user to the database
        await user.save();
    }


    const strikedUser = await mongoose.StrikedUserModel.findOne({
        username: username
    })
    // If user has 3 strikes, kick them from the server
    let embed;
    if (strikedUser.strikeCount >= 3) {
        await KickService.kickUser(username, message);
        const kickedUser = await mongoose.KickedUserModel.findOne({
            username: username
        });
        embed = EmbedBuilder.warningEmbed("You have been kicked!", kickedUser);
    } else {
        const warnedUser = await mongoose.StrikedUserModel.findOne({
            username: username
        });
        embed = EmbedBuilder.warningEmbed("You have been warned!", warnedUser);
    }
    // Respond to message with an embed

    await message.channel.send(embed);


}

// List Specific Users's Strikes
async function showUserStrikes(username, message) {
    const foundUser = await mongoose.StrikedUserModel.findOne({
        username: username
    });
    if (foundUser == null) {
        console.log("No user!");
        throw new Error("That user doesn't exist within the list of previously warned users! Try searching for them in the Kicked User directory by using the !kicked command;");
    } else {
        console.log("WarnService asking EmbedBuilder for a userEmbed....");
        const embed = EmbedBuilder.userEmbed(foundUser);
        console.log('WarnService sending the embed...');
        await message.channel.send(embed);
    }

}

// List All Striked Users
async function listStriked(message) {
    const strikedUsers = await mongoose.getStrikedAsync();
    const embed = EmbedBuilder.strikedUsersEmbed(strikedUsers);
    await message.channel.send(embed);
}

async function clearWarnings(user, message) {
    console.log("Clearing all warnings for user: ", user);


    console.log("Trying to find user in the StrikedUserModel by username: ", user);
    const foundUser = await mongoose.StrikedUserModel.findOne({
        username: user
    });
    if(foundUser == null){
        throw new Error("That user doesn't have any strikes!;")
    }

    console.log("Found this user: ", foundUser);

    foundUser.strikeCount = 0
    console.log("Saving the found user... the user to be saved: ", foundUser);
    await foundUser.save();
    let embed;
    try {
        console.log("Beginning to build embed...");
        embed = EmbedBuilder.zeroStrikesEmbed(foundUser);
    } catch (err) {
        console.log(err);
    }
    await message.channel.send(embed);
}


module.exports = {
    warnUser,
    showUserStrikes,
    listStriked,
    clearWarnings
}