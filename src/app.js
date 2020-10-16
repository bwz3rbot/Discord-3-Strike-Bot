require('dotenv').config({
    path: './pw.env'
});
const discord = require('./config/Discord');
const mongoose = require('./config/mongoose');
(async () => {
    console.log("Attempting to connect to MongoDB...".magenta);
    await mongoose.connect();
})();

// Login with token defined in pw.env
mongoose.db.once('open', async () => {
    console.log("Successfully connected to MongoDB.".green);
    console.log("Attempting to connect to Discord...".magenta);
    await discord.client.login(process.env.TOKEN);
})