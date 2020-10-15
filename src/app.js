require('dotenv').config({
    path: './pw.env'
});
const discord = require('./config/Discord');
const mongoose = require('./config/mongoose');
(async () => {
    await mongoose.connect();
})();

// Login with token defined in pw.env
mongoose.db.once('open', async () => {
    console.log("im in")
    await discord.client.login(process.env.TOKEN);
})