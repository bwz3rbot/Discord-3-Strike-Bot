// 'general' channel
const cmd = require('../../common/util/Command').command;
const EmbedBuilder = require('../../common/util/EmbedBuilder');
const ModActions = require('../actions/ModActions');
const {
    kick
} = require('../actions/ModActions');
const KickService = require('../bot/KickService');
const WarnService = require('../bot/WarnService');
async function on(message, client) {
    // Check if channel was on the list of channels in pw.env
    let filteredChannel = channelFilter(message.channel.name);
    if (!filteredChannel) {
        // If channel is not validated, return from function
        return
    }
    // Check if request was from an admin or guest admin
    const isAdminRequest = ModActions.checkRoleAdmin(message);
    const isGuestAdminRequest = ModActions.checkRoleGuestAdmin(message);
    if (isAdminRequest || isGuestAdminRequest) {
        // Check that message received was not from self or another bot
        if (!(message.author === client.user)) {
            // Build a command and process it through the command switch
            let command = cmd(message.content);
            if (command) {
                try {

                    await channelCommands(command, message, client);
                } catch (err) {
                    // If any errors are thrown, reply to the message with an error message
                    await replyWithErrorMessage(message, err.message);
                }
            }
        }
    } 
}

const channelFilter = function (channel) {
    const userChannels = process.env.LIMIT_TO_CHANNELS.split(",");
    let validatedChannelsList = userChannels.filter(ch => ch.trim() == channel);
    if (validatedChannelsList.length > 0) {
        return validatedChannelsList[0]
    }
}


async function limitToChannel(command, message, client) {
    if (!(message.author === client.user) &&
        message.channel.name === process.env.CHANNEL_NAME) {
        let command = cmd(message.content);
        if (command) {
            try {
                await channelCommands(command, message, client);
            } catch (err) {
                await replyWithErrorMessage(message, err.message);
            }

        }
    }
}

// Command and function definitions:
async function channelCommands(command, message, client) {
    switch (command.directive) {
        case "warn":
            validateUsername(command.args[0]);
            const warnUser = command.args[0];
            const reason = command.args[1];
            if (reason == null) {
                throw new Error("Your warning command must include a reason!;");
            }
            const reasonArray = command.args.slice(1, command.args.length);
            const warnReson = reasonArray.join(' ');
            await WarnService.warnUser(warnUser, warnReson, message);
            break;
        case "list":
            validateUsername(command.args[0]);
            if (!command.args[0]) {
                throw new Error("Command must contain a user to search for!;");
            } else {
                await WarnService.showUserStrikes(command.args[0], message);
            }

            // Command should list current warnings on a specific user
            break;
        case "pardon":
            validateUsername(command.args[0]);
            const clearUser = command.args[0];
            if (clearUser) {
                await WarnService.clearWarnings(clearUser, message);
            }
            // Command should be called with a single argument of @username
            // The command will remove the user from the strike database
            break;

        case "unkick":
            validateUsername(command.args[0]);
            const foundUserToUnkick = await KickService.getKickedUser(command.args[0]);
            if (foundUserToUnkick) {
                await KickService.unkickUser(foundUserToUnkick);
                await message.channel.send(`${foundUserToUnkick.username} has been un-kicked.`);
            }
            break;
        case "kicked":
            validateUsername(command.args[0]);
            const searchKickedUser = command.args[0];
            const foundKickedUser = await KickService.getKickedUser(searchKickedUser);
            if (searchKickedUser) {
                const kickedUserEmbed = EmbedBuilder.userEmbed(foundKickedUser);
                await message.channel.send(kickedUserEmbed);
            }
            break;

        default:
            const helpEmbed = await EmbedBuilder.helpEmbed([{
                syntax: `\`${process.env.COMMAND_PREFIX}warn <@username> <reason>\``,
                description: `gives a user a warning and a strike`
            }, {
                syntax: `\`${process.env.COMMAND_PREFIX}list <@username>\``,
                description: `displays a user's warning history`
            }, {
                syntax: `\`${process.env.COMMAND_PREFIX}pardon <@username>\``,
                description: `sets a users current strike level back to zero`
            }, {
                syntax: `\`${process.env.COMMAND_PREFIX}kicked <@username>\``,
                description: `searches the database for a previously kicked user and displays their history`
            }, {
                syntax: `\`${process.env.COMMAND_PREFIX}unkick <@username>\``,
                description: `removes a user from the list of kicked users`
            }]);
            await message.channel.send(helpEmbed);
            break;
    }
}

const validateUsername = function (username) {
    let nameRegex = new RegExp(/[“\<\@\!”]/);
    let valid = nameRegex.test(username);
    if (!valid) {
        throw new Error("That's not a valid username!;");
    } else {
        return true;
    }
}

async function replyWithErrorMessage(message, err) {
    const msg = err.substring(0, err.indexOf(";"));
    await message.channel.send(`${msg}`);
}

/*

Yea I’m just looking for a simple bot that has a warn function. For example if I were to use .warm @person {reason} it would send an embedded message saying the user was warned for whatever reason. Now if the user gets 3 warnings the bot kicks them from the server. Also I want a command that lists the current warnings on a user and another that clears those warnings. If it’s too much I understand but thanks for contacting me!
*/

module.exports = {
    on
}