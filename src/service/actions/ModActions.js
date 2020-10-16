// Mod Actions

// [Kick From Guild]
async function kick(username, message) {

    // Takes in a msg and command arguments to the 'kick' command
    member = message.mentions.members.first();

    // Kick with reason
    console.log("Kicking member...");
    try {
        await member.kick("Third Strike!");
    } catch (err) {
        if (err) {
            throw new Error("You can't kick that member...;");
        }
    }
    // Provide feedback in admin channel.
    await message.channel.send(`Three strikes, ${username}, you are OUT!`);

}

// [Assign Role]
async function assignRole(message, role) {

    let roles = message.guild.roles;

    let foundRole = roles.cache.find(role => role.name === process.env.ROLE_TO_ASSIGN);


    // Assign the user the role
    message.member.roles.add(foundRole);
}


// [Check Role Admin]
const checkRoleAdmin = function (msg) {
    // Return true if user has role of admin
    return msg.member.roles.cache.some(role => role.name === process.env.ADMIN_ROLE_NAME);
}
const checkRoleGuestAdmin = function (msg) {
    // Return true if user has role of admin
    return msg.member.roles.cache.some(role => role.name === process.env.GUEST_ADMIN_ROLE_NAME);
}

module.exports = {
    kick,
    assignRole,
    checkRoleAdmin,
    checkRoleGuestAdmin
}