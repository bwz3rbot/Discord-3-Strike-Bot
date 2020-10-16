const {
    MessageEmbed,
    Message
} = require('discord.js');
const __ = require('colors');
const NumberedEmojis = require('./NumberEmojis').NumberedEmojis;
const randomMessages = require('./RandomMessages').randomMessages;

const userEmbed = function (user, message) {
    let embedColor;
    user.strikeCount < 3 ? embedColor = `#FFF16B` : embedColor = `#ff1919`
    if (user.strikeCount === 0) {
        embedColor = 'GREEN'
    }

    const strikeCountEmojis = buildNumberedEmojis(user.strikeCount);
    const lifetimeStrikesEmojis = buildNumberedEmojis(user.lifetimeStrikes);
    const embed = new MessageEmbed()
        .setTitle(`This user is at ${strikeCountEmojis} Strikes!`)
        .addField(`Total lifetime warnings: ${lifetimeStrikesEmojis}`, `\u200b`, false)
        .setColor(embedColor)
        .setTimestamp()
        .setDescription(user.username);

    for (let i = user.warnings.length - 1; i > 0; i--) {
        embed.addFields({
            name: `🕑 Warned at:`,
            value: `${user.warnings[i].time}`,
            inline: true
        }, {
            name: `Warning # ${buildNumberedEmojis(i)}`,
            value: `${user.warnings[i].reason}`,
            inline: true
        }, {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        })
    }
    return embed;

}

const chooseMessage = function () {
    const randomNumber = Math.floor((Math.random() * randomMessages.length - 1) + 1);
    return randomNumber;
}
// Help Embed
async function helpEmbed(commands) {
    const randomMessage = await randomMessages[chooseMessage()].text()

    const MYNAME = "<@!752946263254630531>";
    const helpEmbed = new MessageEmbed()
        .setTitle(`\t\t${process.env.SET_USERNAME}  |  Command Reference  :book:`)
        .setFooter(randomMessage)
        .setColor('RANDOM')
        .setDescription(`\n\nThis bot was made by ${MYNAME} \n\nUse these commands to interact with the bot:`)
        .setURL('https://github.com/web-temps/Discord-3-Strike-Bot/blob/main/COMMANDS.MD');
    commands.forEach(command => {
        helpEmbed.addFields({
            name: command.syntax,
            value: command.description,
            inline: true
        })
    })
    helpEmbed.addFields({
        name: '\u200b',
        value: '\u200b',
        inline: false,
    })
    return helpEmbed
}

// Takes in a number, possibly a string value of a number,
// Returns the emoji codes to represent it
// Can be more than one digit.
const buildNumberedEmojis = function (number) {

    const LIFETIME_STRIKES_STRING = number.toString();

    // Go over each ditit of the number string and find an emioji pattern for each number present
    let emojiStringArray = []
    for (i = 0; i < LIFETIME_STRIKES_STRING.length; i++) {
        let foundEmojiString = NumberedEmojis.get(parseInt(LIFETIME_STRIKES_STRING[i]));

        emojiStringArray.push(foundEmojiString);
    }
    let completeEmojiString = emojiStringArray.join("");

    completeEmojiString = completeEmojiString.replace(" ", "");

    return completeEmojiString;
}
// Warning Embed
const warningEmbed = function (message, user) {
    let embedColor;

    user.strikeCount < 3 ? embedColor = `DARK_GOLD` : embedColor = `#ff1919`
    const lifetimeStrikesEmojis = buildNumberedEmojis(user.lifetimeStrikes);
    const strikeCountEmojis = buildNumberedEmojis(user.strikeCount);
    const embed = new MessageEmbed()
        .setTitle(message)
        .addField(`Total lifetime warnings: ${lifetimeStrikesEmojis}`, `\u200b`, false)
        .setColor(embedColor)
        .setDescription(user.username)
        .setTimestamp();
    const warning = user.warnings[user.lifetimeStrikes - 1]

    embed.addFields({
        name: `
        Strike ${strikeCountEmojis}`,
        value: `${warning.reason}`,
        inline: true
    }, {
        name: '\u200b',
        value: '\u200b',
        inline: false,
    });

    for (let i = 1; i <= user.strikeCount; i++) {
        embed.addField('\u200b', ':x:', true);
    }
    return embed;
}

async function zeroStrikesEmbed(user) {
    console.log("Getting a random message...");
    const randomMessage = await randomMessages[chooseMessage()].text()

    const embed = new MessageEmbed()
        .setTitle(`🥳  Congradulations!  🎉 You have been pardoned!`)
        .addField(`Total lifetime warnings: ${buildNumberedEmojis(user.lifetimeStrikes)}`, `\u200b`, false)
        .setColor('GREEN')
        .setFooter(randomMessage)
        .setDescription(`${user.username} is back at :zero: strikes!`);


    return embed;


}

module.exports = {
    warningEmbed,
    userEmbed,
    zeroStrikesEmbed,
    helpEmbed
}