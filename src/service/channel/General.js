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
    const isAdminRequest = ModActions.checkRoleAdmin(message);
    const isGuestAdminRequest = ModActions.checkRoleGuestAdmin(message);
    if (isAdminRequest || isGuestAdminRequest) {
        console.log("admin validated");
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
    } else {
        console.log("non admin user");
    }
    

}
// Command and function definitions:
async function channelCommands(command, message, client) {
    console.log("Going through the channel commands, first validating the username...")
    console.dir(command)
    switch (command.directive) {
        case "warn":
            validateUsername(command.args[0]);
            console.log("command was warn");
            const warnUser = command.args[0];
            const reason = command.args[1];
            if (reason == null) {
                throw new Error("Your warning command must include a reason!;");
            }
            const reasonArray = command.args.slice(1, command.args.length);
            const warnReson = reasonArray.join(' ');
            console.log("args were: ", warnUser, warnReson);
            await WarnService.warnUser(warnUser, warnReson, message);
            break;
        case "list":
            console.log("was command list");
            console.log("args were: ", command.args);
            console.log("validating username...")
            validateUsername(command.args[0]);

            if (!command.args[0]) {
                console.log("no args. listing all striked users.");
                throw new Error("Command must contain a user to search for!;");
            } else {
                console.log("user arg present. showing only one user strikes.");
                await WarnService.showUserStrikes(command.args[0], message);
            }

            // Command should list current warnings on a specific user
            break;
        case "clear":
            console.log("Command was clear.");
            validateUsername(command.args[0]);
            const clearUser = command.args[0];
            console.log("clearing user strikes: ", clearUser);
            if (clearUser) {
                console.log("Asking Warn service to clear warnings for user...");
                await WarnService.clearWarnings(clearUser, message);
            }
            // Command should be called with a single argument of @username
            // The command will remove the user from the strike database
            break;

        case "kicked":
            console.log("command was kicked");
            validateUsername(command.args[0]);
            const searchKickedUser = command.args[0];
            const foundKickedUser = await KickService.getKickedUser(searchKickedUser);
            console.log("found this previously kicked user: ", foundKickedUser);

            if (searchKickedUser) {
                const kickedUserEmbed = EmbedBuilder.userEmbed(foundKickedUser);
                await message.channel.send(kickedUserEmbed);
            }
            break;

        default:
            message.channel.send(`\`\`\`
            !warn <@username> <reason> (gives a user a warning!)
            !list <@username> (displays a users warning history)
            !clear <@username> (removes all strikes from a user)
            !kicked <@username> (displays warning history of a previously kicked user)
            \`\`\``)
            break;
    }
}

const validateUsername = function (username) {
    console.log("Validating username: ", username);
    console.log("creating regex..");
    let nameRegex = new RegExp(/[“\<\@\!”]/);
    console.log("the regex: ", nameRegex);
    console.log("Testing name against the regex... Name: ", username);
    let valid = nameRegex.test(username);

    if (!valid) {
        console.log("username invalid! throwing error...")
        throw new Error("That's not a valid username!;");
    } else {
        console.log("Username valid. Continuing!");
        return true;
    }

}

async function replyWithErrorMessage(message, err) {
    const msg = err.substring(0, err.indexOf(";"));
    console.log("Replying with error message: ", msg);
    await message.channel.send(`${msg}`);
}

/*

Yea I’m just looking for a simple bot that has a warn function. For example if I were to use .warm @person {reason} it would send an embedded message saying the user was warned for whatever reason. Now if the user gets 3 warnings the bot kicks them from the server. Also I want a command that lists the current warnings on a user and another that clears those warnings. If it’s too much I understand but thanks for contacting me!
*/

module.exports = {
    on
}