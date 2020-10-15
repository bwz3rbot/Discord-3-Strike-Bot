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
    console.log("First checking if user exists within guild.");
    console.log("Searching for this username: ", username);
    console.log("using this message: ", message);
    let formattedUserId = username.replace("<@!", "");
    formattedUserId = formattedUserId.replace(">", "");
    formattedUserId = formattedUserId.trim();
    console.log("User id: ", formattedUserId);

    const members = message.guild.members


    // members.cache.forEach(member => {
    //     console.log(member.user);
    // })

    console.log("Finding user wher user id = ", formattedUserId);
    const userFound = members.cache.find(member => member.user.id === formattedUserId);

    console.log("User found: ", userFound);
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
        console.log("User was empty. Creating new user.");
        // Give a warning
        let maybeuser = await mongoose.KickedUserModel.findOne({
            username: username
        });
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
    console.log("Now checking this user!: ", strikedUser);
    // If user has 3 strikes, kick them from the server
    let embed;
    if (strikedUser.strikeCount >= 3) {
        console.log("Strike count was 3! Warn Service asking KickService to kick user!")
        await KickService.kickUser(username, message);
        console.log("Warn Service finding KickedUser in model by username...");
        const kickedUser = await mongoose.KickedUserModel.findOne({
            username: username
        });
        console.log("Building the warning embed for the kicked user...");
        embed = EmbedBuilder.warningEmbed("You have been kicked!", kickedUser);
    } else {
        console.log("mongoose finding user: ", username);
        const warnedUser = await mongoose.StrikedUserModel.findOne({
            username: username
        });
        console.log("Building embed... with the warnedUser: ", warnedUser);
        embed = EmbedBuilder.warningEmbed("You have been warned!", warnedUser);
    }
    // Respond to message with an embed
    console.log("sending embed...");
    await message.channel.send(embed);


}

// List Specific Users's Strikes
async function showUserStrikes(username, message) {
    console.log("Showing User Strikes: ", username);
    const foundUser = await mongoose.StrikedUserModel.findOne({
        username: username
    });
    if (foundUser == null) {
        console.log("No user!");
        throw new Error("That user doesn't exist within the list of previously warned users! Try searching for them in the Kicked User directory by using the !kicked command;");
    } else {
        console.log("Found user: ", foundUser);
        const embed = EmbedBuilder.userEmbed(foundUser);
        await message.channel.send(embed);
    }

}

// List All Striked Users
async function listStriked(message) {
    const strikedUsers = await mongoose.getStrikedAsync();
    console.log(strikedUsers);
    const embed = EmbedBuilder.strikedUsersEmbed(strikedUsers);
    await message.channel.send(embed);
}

async function clearWarnings(user, message) {
    console.log("Clearing all warnings for user: ", user);
    console.log("Finding user in StrikedUser Database by username:", user);
    const foundUser = await mongoose.StrikedUserModel.findOne({
        username: user
    });
    console.log("Found user: ", foundUser);
    foundUser.strikeCount = 0
    console.log("Setting foundUser strikeCount to 0 and saving the instance.");
    await foundUser.save();
    console.log("Building User Embed with user: ", foundUser);
    let embed;
    try {
        embed = EmbedBuilder.zeroStrikesEmbed(foundUser);
    } catch (err) {
        console.log(err);
    }
    console.log("Sending this embed to channel:", embed);
    await message.channel.send(embed);
}


module.exports = {
    warnUser,
    showUserStrikes,
    listStriked,
    clearWarnings
}