// 'general' channel
const cmd = require('../../common/util/Command').command;
const ModActions = require('../actions/ModActions');
const getKickedUser = require('../../service/bot/KickService').getKickedUser;
async function on(message, client) {
    if (!(message.author === client.user) &&
        message.channel.name === process.env.TAG_ME_CHANNEL) {
        let command = cmd(message.content);
        if (command) {
            try {
                await channelCommands(command, message);
            } catch (err) {
                await replyWithErrorMessage(message, err.message);
            }

        }


    }
}
// [Commands]
async function channelCommands(command, message) {
    const userHasRole = checkUserHasRole(message);
    if (userHasRole) {
        return
    }

    switch (command.directive) {
        // Assign role 'user'
        case process.env.TAG_COMMAND:
            await checkUserKickStatus(message.author.id);
            await ModActions.assignRole(message);
            await message.channel.send(process.env.WELCOME_MESSAGE);
            break;
        default:
            await message.channel.send(`Type \`${process.env.COMMAND_PREFIX}${process.env.TAG_COMMAND}\` to be assigned the role of ${process.env.ROLE_TO_ASSIGN}.`);
            break;
    }

}

async function replyWithErrorMessage(message, err) {
    const msg = err.substring(0, err.indexOf(";"));
    await message.channel.send(`${msg}`);
}

async function checkUserKickStatus(id) {
    let possiblyKickedUser;
    try {
        possiblyKickedUser = await getKickedUser(`<@!${id}>`);
    } catch (err) {
    }
    if (possiblyKickedUser) {
        throw new Error(`${process.env.UNWELCOME_MESSAGE};`);
    }

}

const checkUserHasRole = function (message) {
    const foundRole = message.member.roles.cache.some(role => role.name === process.env.ROLE_TO_ASSIGN);
    return foundRole;

}
exports.on = on