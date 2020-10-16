// Require the one and only new Discord.Client()
const __ = require('colors');
const dateFormat = require('dateformat');
const Discord = require('discord.js');
const client = new Discord.Client();
const channels = require('../service/channel/ChannelList').channels;
// On ready listener
client.on("ready", async () => {
    // Generate timesteamp for console log
    dateTime = dateFormat(new Date())
    console.log(`Successfully Connected as ${client.user.tag} | ${dateTime}`.green);
    await client.user.setPresence({ // Set Presence
            activity: {
                type: process.env.ACTIVITY_TYPE,
                name: process.env.ACTIVITY_NAME
            },
            status: 'idle'
        })
        .catch(console.error) // Log any errors
        await client.user.setUsername(process.env.SET_USERNAME);
});
// On Message Listener
client.on('message', async (msg) => {
    if (!msg.author.bot) {
        // Runs down the list of channels
        for (const channel of channels) {
            await channel.on(msg, client);
        }
    }
});


module.exports = {
    client,
    Discord
}