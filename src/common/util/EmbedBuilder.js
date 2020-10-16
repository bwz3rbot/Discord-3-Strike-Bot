const {
    MessageEmbed,
    Message
} = require('discord.js');
const NumberedEmojis = require('./NumberEmojis').NumberedEmojis;
const randomMessages = require('./RandomMessages').randomMessages;

const userEmbed = function (user) {
    console.log("Setting description to: ", user.username);
    console.log("Building the user embed for user: ", user);

    let embedColor;
    user.strikeCount < 3 ? embedColor = `#FFF16B` : embedColor = `#ff1919`;
    const strikeCountEmojis = buildNumberedEmojis(user.strikeCount);
    const lifetimeStrikesEmojis = buildNumberedEmojis(user.lifetimeStrikes);
    console.log()
    const embed = new MessageEmbed()
        .setTitle(`This user is at ${strikeCountEmojis} Strikes!\nRecent warning history:`)
        .addField(`lifetime warnings: ${lifetimeStrikesEmojis}`, `\u200b`, false)
        .setColor(embedColor)
        .setTimestamp()
        .setDescription(user.username);

    console.log("Successfully generated base embed. now adding fields...");

    for (let i = user.warnings.length - 1; i > 0; i--) {
        console.log("ITERATION ", i);
        console.log(`adding field with warning: `, user.warnings[i]);
        embed.addFields({
            name: `Warning ${buildNumberedEmojis(i)}`,
            value: `${user.warnings[i].reason}`,
        }, {
            name: `Warned at 🕑`,
            value: `${user.warnings[i].time}`
        }, {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        })
        console.log("Added the field. derementing index ...");
    }
    console.log("Returning this embed: ", embed);
    return embed;

}

const chooseMessage = function () {
    const randomNumber = Math.floor((Math.random() * randomMessages.length - 1) + 1);
    console.log("Choosing random number: ", randomNumber);
    return randomNumber;
}
// Help Embed
const helpEmbed = function (commands) {

    const MYNAME = "<@!752946263254630531>";
    console.LOG
    const helpEmbed = new MessageEmbed()
        .setTitle(`\t\t${process.env.SET_USERNAME}  ||  Command Reference`)
        .setFooter(randomMessages[chooseMessage()].text)
        .setColor('BLACK')
        .setTimestamp()
        .setDescription(`This bot was made by ${MYNAME} \nUse these commands to interact with the bot:`)
        .setURL('https://github.com/web-temps/Discord-3-Strike-Bot/blob/main/COMMANDS.MD');
    commands.forEach(command => {
        helpEmbed.addFields({
            name: command.syntax,
            value: command.description
        })
    })
    return helpEmbed
}

// Takes in a number, possibly a string value of a number,
// Returns the emoji codes to represent it
// Can be more than one digit.
const buildNumberedEmojis = function (number) {

    console.log('Building the numbered emojis for: ', number);

    console.log('Checking if number is a string...');
    console.log(typeof number);
    console.log("converting number to a string...");
    const LIFETIME_STRIKES_STRING = number.toString();
    console.log("LIFETIME_STRIKES_STRING: ", LIFETIME_STRIKES_STRING);
    console.log("Accessing this map: ", NumberedEmojis);
    // Go over each ditit of the number string and find an emioji pattern for each number present
    let emojiStringArray = []
    for (i = 0; i < LIFETIME_STRIKES_STRING.length; i++) {
        console.log("Finding emoji pattern for this string: ", LIFETIME_STRIKES_STRING[i]);
        let foundEmojiString = NumberedEmojis.get(parseInt(LIFETIME_STRIKES_STRING[i]));
        console.log("Found this emoji string: ", foundEmojiString);
        emojiStringArray.push(foundEmojiString);
    }
    console.log("Generated this array of strings: ", emojiStringArray);
    let completeEmojiString = emojiStringArray.join("");

    completeEmojiString = completeEmojiString.replace(" ", "");

    return completeEmojiString;
}
// Warning Embed
const warningEmbed = function (message, user) {
    console.log("Building an embed for the user: ", user);

    let embedColor;

    user.strikeCount < 3 ? embedColor = `DARK_GOLD` : embedColor = `#ff1919`
    console.log("user.strikeCount: ", user.strikeCount);
    console.log("embedColor: ", embedColor);


    const lifetimeStrikesEmojis = buildNumberedEmojis(user.lifetimeStrikes);
    const strikeCountEmojis = buildNumberedEmojis(user.strikeCount);

    console.log("Got these strings back: ", lifetimeStrikesEmojis, strikeCountEmojis);
    const embed = new MessageEmbed()
        .setTitle(message)
        .addField(`lifetime warnings: ${lifetimeStrikesEmojis}`, `\u200b`, false)
        .setColor(embedColor)
        .setDescription(user.username)
        .setTimestamp();
    console.log("Successfully generated the base MessageEmbed. Now adding fields...");
    const warning = user.warnings[user.lifetimeStrikes - 1]
    console.log("current warning to display: ", warning);

    embed.addFields({
        name: `
        Strike ${strikeCountEmojis}`,
        value: `${warning.reason}`
    }, {
        name: '\u200b',
        value: '\u200b',
        inline: false,
    });
    console.log("Adding x's to the embed... ", user.strikeCount);
    for (let i = 1; i <= user.strikeCount; i++) {
        console.log("adding :x: emoji");
        embed.addField('\u200b', ':x:', true);
    }
    return embed;
}

const zeroStrikesEmbed = function (user) {
    console.log("Building a zero strikes embed for user: ", user);

    const embed = new MessageEmbed()
        .setTitle(`🥳  Congradulations!  🎉 You have been pardoned!`)
        .addField(`lifetime warnings: ${buildNumberedEmojis(user.lifetimeStrikes)}`, `\u200b`, false)
        .setColor('GREEN')
        .setTimestamp()
        .setDescription(`${user.username} is back at :zero: strikes.`);


    return embed;


}

module.exports = {
    warningEmbed,
    userEmbed,
    zeroStrikesEmbed,
    helpEmbed
}