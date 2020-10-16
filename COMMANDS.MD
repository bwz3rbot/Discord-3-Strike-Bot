# Discord 3 Strike Warning System Command Reference

## Table of Contents

- [Tag-Me](#tag-me)
    - [Tag](#tag-me.tag)
- [Warning System](#warn)
    - [Warn](#warn.warn)
    - [List](#warn.list)
    - [Pardon](#warn.pardon)
    - [Kicked](#warn.kicked)


# Tag-Me <a name = "tag-me"></a>
## Tag <a name = "tag-me.tag"></a>
### Using this function will grant a new user a role on your server. The role that it grants should be configured to grant a user viewing rights to your other channels. The purose of this function is to have a channel where a new user can read a set of defined rules before using the *tag* command to __agree__ to your terms.
`$tag`


# Warning System <a name = "warn"></a>
## Warn <a name = "warn.warn"></a>
### This function will allow an admin to send a warning to a user.
`$warn <@username> <reason for warning>`


## List <a name = "warn.list"></a>
### A server admin can pull up a user's warning history at any time by using the $list command
`$list <@username>`

## Pardon <a name = "warn.pardon"></a>
### A server admin can use this command to clear the strikes against a specific user
`$pardon <@username>`

## Kicked <a name = "warn.kicked"></a>
### A server admin can use this command to see a user's history who has been previously kicked from the guild for having too many strikes against them
`$kicked <@username>`