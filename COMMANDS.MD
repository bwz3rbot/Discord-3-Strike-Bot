# Discord 3 Strike Warning System Command Reference

## Table of Contents

- [About](#about)
- [Tag-Me](#tag-me)
    - [Tag](#tag-me.tag)
- [Warning System](#warn)
    - [Warn](#warn.warn)
    - [List](#warn.list)
    - [Pardon](#warn.pardon)
    - [Kicked](#warn.kicked)
    - [Unkick](#warn.unkick)


# About <a name = "about"></a>
This bot allows for an administrator to set a custom command prefix. This means that the command prefix (as refered to in this guide by the symbol: __$__ ) may differ from server to server.  Command names will remain the same, with the exception of the *tag* command. The tag command may be called by a different name as the bot allows for an administrator to do so as well. A server which uses this function should have information on how to use it displayed on their welcome page.


# Tag-Me <a name = "tag-me"></a>
## Tag <a name = "tag-me.tag"></a>
### Using this function will grant a new user a role on your server. The role that it grants should be configured to allow a user viewing rights to your other channels. The purpose of this function is to have a channel where a new user can read a set of rules you define. Before using the *tag* command, they must to agree to your terms. This command may be named differntly per server as it is defined in the bots configuration file. If a user has been previously kicked using the `warn` command, they will be denied a user role upon calling this command.
`$tag`


# Warning System <a name = "warn"></a>
## Warn <a name = "warn.warn"></a>
### This function will allow an admin to send a warning to a user. Upon receiving a third warning, the user will be instantly kicked from the server. Once the user has been kicked using this command, they will no longer be allowed to use the `tag` command. A server admin may use the `unkick` command to remove the user from the Previously Kicked database and allow them to use the `tag` command once more.
`$warn <@username> <reason for warning>`


## List <a name = "warn.list"></a>
### A server admin can pull up a user's warning history by using the `list` command
`$list <@username>`

## Pardon <a name = "warn.pardon"></a>
### A server admin can use this command to clear the strikes against a specific user. The user's warning history will remain viewable for admins to pull up by using the `list` command.
`$pardon <@username>`

## Kicked <a name = "warn.kicked"></a>
### A server admin can use this command to see the history of a user who has been previously kicked from the guild through using the `warn` command
`$kicked <@username>`

## Unkick <a name = "warn.kicked"></a>
### A server admin can use this command to remove a user from the *Previously Kicked* Database. The user will once again be allowed to trigger the `tag` command to gain access to your server.
`$unkick <@username>`