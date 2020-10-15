// Checks that command starts with the prefix as defined in the pw.env file
const pre = process.env.COMMAND_PREFIX || "!";
const prefix = function (str) {
    if (str.startsWith(pre)) {
        return true
    }
}

// Takes in text (from on 'message' listener)
// Returns a command/arguments
const buildCMD = function (str) {
    const args = str.slice(pre.length).trim().split(/ +/g);
    const directive = args.shift().toLowerCase();
    const command = {
        directive,
        args
    }
    return command;
}

const command = function (message) {
    if (prefix(message)) {
        return buildCMD(message)
    }
}

module.exports = {
    command
}