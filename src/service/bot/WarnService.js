const mongoose = require('../../config/mongoose');
const dateformat = require('dateformat');
const KickService = require('./KickService');
const EmbedBuilder = require('../../common/util/EmbedBuilder');
class Warning {
    constructor(reason) {
        this.time = dateformat(new Date());
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
    // First check if user exists witin the database
    let user = await mongoose.getStrikedUser(username);

    // If user does not exist, create a new user object

    if (user == null) {
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


    const strikedUser = await mongoose.getStrikedUser(username);
    // If user has 3 strikes, kick them from the server
    let embed;
    if (strikedUser.strikeCount >= 3) {
        await KickService.kickUser(username, message);
        const kickedUser = await mongoose.getKickedUser(username);
        embed = EmbedBuilder.warningEmbed("You have been kicked!", kickedUser);
    } else {
        const warnedUser = await mongoose.getStrikedUser(username);
        embed = EmbedBuilder.warningEmbed("You have been warned!", warnedUser);
    }
    // Respond to message with an embed

    await message.channel.send(embed);


}

// List Specific Users's Strikes
async function showUserStrikes(username, message) {
    const foundUser = await mongoose.getStrikedUser(username);
    if (foundUser == null) {
        throw new Error("That user doesn't exist within the list of previously warned users! Try searching for them in the Kicked User directory by using the !kicked command;");
    } else {
        console.log("WarnService Building embed for this user: ", foundUser);
        const embed = EmbedBuilder.userEmbed(foundUser);
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

    const foundUser = await mongoose.getStrikedUser(user);
    if (foundUser == null) {
        throw new Error("That user doesn't have any strikes!;")
    }
    foundUser.strikeCount = 0
    await foundUser.save();
    let embed;
    try {
        embed = await EmbedBuilder.zeroStrikesEmbed(foundUser);
    } catch (err) {}
    await message.channel.send(embed);
}


module.exports = {
    warnUser,
    showUserStrikes,
    listStriked,
    clearWarnings
}