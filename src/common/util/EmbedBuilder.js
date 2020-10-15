const {
    MessageEmbed,
    Message
} = require('discord.js');

const userEmbed = function (user) {
    console.log("Building the user embed for user: ", user);

    let embedColor;
    user.strikeCount < 3 ? embedColor = `#FFF16B` : embedColor = `#ff1919`;
    const embed = new MessageEmbed()
        .setTitle(`This user is at (${user.strikeCount}) Strikes!\nFull warning history:`)
        .setFooter(`lifetime warnings: ${user.lifetimeStrikes}`)
        .setColor(embedColor)
        .setTimestamp()
        .setDescription(user.username);

    console.log("Successfully generated base embed. now adding fields...");
    let count = 1;
    user.warnings.forEach(warning => {
        console.log(`adding field with warning: `, warning);
        embed.addFields({
            name: `Warning (${count}):`,
            value: `${warning.reason}`,
        }, {
            name: `Warned at 🕑`,
            value: `${warning.time}`
        }, {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        })
        count++;
    })
    console.log("Returning this embed: ", embed);
    return embed;

}

const warningEmbed = function (message, user) {
    console.log("Building an embed for the user: ", user);

    let embedColor;
    user.strikeCount <= 3 ? embedColor = `#FFF16B` : embedColor = `#ff1919`

    const embed = new MessageEmbed()
        .setTitle(message)
        .setFooter(`lifetime warnings: ${user.lifetimeStrikes}`)
        .setColor(embedColor)
        .setDescription(user.username)
        .setTimestamp();
    console.log("Successfully generated the base MessageEmbed. Now adding fields...");
    const warning = user.warnings[user.lifetimeStrikes - 1]
    console.log("current warning to display: ", warning);

    embed.addFields({
        name: `Strike (${user.strikeCount}):`,
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
        .setTitle(`🥳Congradulations!🎉 You are back at 0 strikes!`)
        .setFooter(`lifetime warnings: ${user.lifetimeStrikes}`)
        .setColor('GREEN')
        .setTimestamp()
        .setDescription(user.username);


    return embed;


}

module.exports = {
    warningEmbed,
    userEmbed,
    zeroStrikesEmbed
}