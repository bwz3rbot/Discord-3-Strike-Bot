# Discord 3 Strike Warning System

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
    - [Prerequisites](#getting_started)
    - [Environment Variables](#env_var)
    - [Installing](#installing)
- [Running](#running)
    - [Windows](#windows)
    - [Mac And Linux](#mac-linux)
- [Backing Up Your Data](#backup)
- [Usage](#usage)
    - [Tag-Me](#tag-me)
    - [Warning System](#warning)
- [Example Output](#example)
    - [Tag-Me](#example.tag)
    - [Warning System](#example.warning)


# About <a name = "about"></a>

This Discord bot will scan a set of user defined channels for commands. It only accepts commands from users with administrative roles on your server. It allows for two seperate roles to use the bot. Administrators of the server may call on the bot to give users a ***warning*** in the form of a message embed. 3 seperate warnings without having been ***pardoned*** will result in the user being kicked from the server. An administrator can use the bot to ***pardon*** a user of their current strike level at any time. This pardon function resets the strike count of a user to 0.

The bot also comes with a ***tag-me*** feature which allows a server owner to have a welcome message landing page, or ***rules page*** for your server. It scans a __tag-me__ channel to assign users a role, allowing them access to the rest of your content. If you decide you do not wish to use this feature, you may simply edit the environment variable TAG_ME_CHANNEL to equal a channel name that does not exist within your server.

# Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine.

# Prerequisites <a name = "pres"></a>

This bot runs on Node.js with a MongoDB database. Be sure that you download and install both of these products carefully and correctly. The install procedures of both are rather straightforward, especially for Windows users. See below for links to the downloads:

\
[Official MongoDB Download and Installation Instructions](https://docs.mongodb.com/manual/administration/install-community/)\
[Official Node.JS Download](https://nodejs.org/en/download/)

-----
\
Once you have Mongo and Node installed on your system, Head on over to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.

<br>

1. Click the `New Application` button to create a new bot.

<img src="https://i.imgur.com/RS7HNEk.png">

<br>
<br>

2. Give it a name and click `Create`

<img src="https://i.imgur.com/n0lJjsW.png">

<br>
<br>

3. Navigate to the Bot tab and click to `Add Bot`.

<img src="https://i.imgur.com/N3L6bln.png">

<br>
<br>

4. Now `Click to Reveal Token`. You'll need this token to authenticate your bot in the next step.

<img src='https://i.imgur.com/X115w03.png'>

<br>
<br>

<strong>Never share this token with anyone! It is used to authenticate your bot! Basically it is your bot's password.</strong> Anyone with access to this token will have *full* control of the bot. That means that if you have granted the bot an admin role on your server (which you would need to for it to work), __anyone with access to your token will have admin rights on your server__. You can probably imagine that this is not something you really want to happen! No problem, though as if the token ever does in fact become leaked, you may simply go back to the [Developer Portal](https://discord.com/developers/applications) on your bot's page and click the button to __*regenerate*__ a new token for your bot. Paste it back into your `pw.env` file (which is explained below) and you're good to go!

# Environment Variables <a name = "env_var"></a>

This bot is ***highly customizable***
-----
The environment variables listed below are stored in your __pw.env__ file. You will notice a single file that exists within the root directory of this codebase called __pw.envEXAMPLE.__ Here is where you can customize your bot. The only requirements are that you input the correct token for your bot and ACTIVITY_TYPE is limited to only 3 choices. But other than that, you have a number of variables to choose from to make the bot fit your server's personality a bit more. See below for definitions of what they all mean.

-----

<strong>TOKEN</strong> Taken from the [Developer Portal](https://discord.com/developers/applications) when you created your app.\
<strong>LIMIT_TO_CHANNELS</strong> The names of each channel you wish the bot to listen for commands on. This variable must be formatted as a list seperated by commas.\
<strong>COMMAND_PREFIX</strong> A single character you wish to prefix commands with.\
<strong>ACTIVITY_TYPE</strong> Must be set to either PLAYING, LISTENING or WATCHING for the bot to function correctly as defined [here](https://discord.js.org/#/docs/main/stable/typedef/ActivityType). This bot __does not allow__ for a user to use the STREAMING or CUSTOM_STATUS activity types.\
<strong>ACTIVITY_NAME</strong> Displays along with the activity type.\
<strong>SET_USERNAME</strong> The username you wish your bot to display.\
<strong>ADMIN_ROLE_NAME</strong> The role a user is required to have in order to activate the bot.\
<strong>GUEST_ADMIN_ROLE_NAME</strong> A secondary user role which also has access to the bot.\
<strong>TAG_ME_CHANNEL</strong> The name of the channel for the tag-me function to run on.\
<strong>TAG_COMMAND</strong> A name for the tag-me command to listen for. Should be set to something similar to 'agree' if you're having your users read a set of rules, or something more specific to your sub. It must be a single word command. It receives no arguments. This function __will not be limited to admin use like the others.__\
<strong>ROLE_TO_ASSIGN</strong> The name of the role assigned by the tag-me command. This named role is used to grant access to your server. Its primary purpose is to have your users agree to a set of instructions before being allowed access to the rest of your content.\
<strong>WELCOME_MESSAGE</strong> A brief message that will be sent to the tag-me channel after a user is given a role.\
<strong>UNWELCOME_MESSAGE</strong> A message that will be displayed to users who attempt to use the `tag` command while being in the list users previously kicked from the guild.

<strong>If you do not wish to use the tag-me function, simply set the TAG_ME_CHANNEL variable to a channel name that does not exist within your server and the bot will overlook it. Enabling the tag-me channel for your server is explained in the [final section](https://github.com/web-temps/Discord-3-Strike-Bot#tag-me-) of this guide.</strong><br>


_____
### Below is an example of how you should fill out your environment variables.

This exact file can be found within the root directory and is called __pw.envEXAMPLE__. By filling in your token here, you are allowing the code to connect to discord under your bots' credentials. By removing EXAMPLE from the end of the filename, the application will know where to find the file and will use the variables you have set in it to log in and run the bot. If any of these variables are filled out incorrectly, the application may throw an error and stop executing. Be sure you have followed all the instructions carefully and then fill in these fields:

```
TOKEN='NzY2Mjg4NTk3OTU4NjU2MDIw.X4hL3g.a9lHHyS-blGotkeUwhjgFPQDucA'
LIMIT_TO_CHANNELS="command-channel,general-chat"
COMMAND_PREFIX="!"
ACTIVITY_TYPE="WATCHING"
ACTIVITY_NAME="you! 👀"
SET_USERNAME="⚾ThreeStrikeBot🤖"
ADMIN_ROLE_NAME="admin"
GUEST_ADMIN_ROLE_NAME="Guest Admin"
TAG_ME_CHANNEL="tag-me"
TAG_COMMAND="agree"
ROLE_TO_ASSIGN="user"
WELCOME_MESSAGE="Welcome to the server!"
UNWELCOME_MESSAGE="You are not welcome here."
```

# Installing <a name = "installing"></a>

First, you must install Node.js and MongoDB. You can use the official download links to get [Node.js here](https://nodejs.org/en/download/) and [MongoDB here](https://docs.mongodb.com/manual/administration/install-community/).

To check that Node and Mongo have been correctly installed, run these commands:
```
$ node --version
> v12.18.3
$ mongo --version
> v4.4.0
```


Once Node and Mongo are installed, and you have your application created in the [Discord Developer's Portal](https://discord.com/developers/applications), download the source code on this page and unzip it to a safe spot on your hard drive.



Before running the app, you need to use npm to install packages required to run a Discord bot, and also to access the database.

To do so, first you must open your terminal, and `cd` into the folder containing the source code you just downloaded. Now run this command from the root folder of the codebase:
```
$ mkdir database
$ mkdir backups
$ npm i
```

These two commands will
1. Create a directory for which store your data
2. Create a directory where you can store your database backups
3. Install all the nececary dependencies as defined in the [package.json](https://github.com/web-temps/Discord-3-Strike-Bot/blob/main/package.json) file

Once these packages are completely installed, you will be only one step away from running your bot.

# Running <a name = "running"></a>

Now that you've generated a token for a new app, your environment variables have bet set, and you've installed the dependencies, you are ready to run the bot! Before running the bot you must, of course, start the database instance. It is very important that you always run the database from the same location. This is why I have included a simple .bat (for windows users) and .sh (for linux) file for you to run from, which will ensure consistency of the data.

## Windows <a name = "windows"></a>

Windows users simply click `mongo.bat` to start the database in the correct location.\
Once mongo is up and running, you may use `run.bat` to start the bot.

## Mac and Linux <a name = "mac-linux"></a>

Mac and Linux users must use the .sh versions of the files. You must also first set them as executable before using. To do so run these commands:
```
$ sudo chmod +x mongo.sh
$ sudo chmod +x run.sh
```
Now that you've given execute permission on both files for your machine, you can use them to run the bot.

First open a terminal window and CD into the bot. The database needs to be running in its own window before running the bot. Use this command to run the MongoDB server instance in the correct location:
```
$ ./mongo.sh
```

With the database up and running, you may open another terminal window and run this command to start the bot:
```
$ ./run.sh
```

On success, you should see a message that looks exactly like this one:
```
> Attempting to connect to MongoDB...
> Successfully connected to MongoDB.
> Attempting to connect to Discord...
> Successfully Connected as ⚾ThreeStrikeBot�#1852 | Thu Oct 15 2020 20:16:21
```


# Backing Up Your Data <a name = "backup"></a>

It's strongly recommended that you back up your database! That is where all your user data is stored and if anything happens to it, its not going to be a good time for your server. Luckily it is very easy to copy the database directory from one folder to another for safe keeping. If anything were to happen to your data, you may simply delete the bad folder and paste in the backup documents. It should all work out just fine.

You should also note that you should never attempt this backup method while the database is running. The files will not be correctly copied and your existing data may not work right afterward!

One more thing to note is that simply storing all your backups in the __backups__ folder I had you make in the previous step, isn't going to cut it if you really want to be 100% sure the the data will be safe. You should probably keep it on another device altogether. Best if you kept it in cloud storage somewhere in case something were to happen to your personal storage device. Cloud storage is always the safest bet when keeping important data that your server relies on. It rules out the possibility of your own hardware failing.




# Usage <a name = "usage"></a>
>### [Commands Quick Reference](https://github.com/web-temps/Discord-3-Strike-Bot/blob/main/COMMANDS.MD#discord-3-strike-warning-system-command-reference)
<br>


## Tag-Me <a name = "tag-me"></a>

The `tag` command is used to host a welcome message on your server.\
It allows an administrator to create a set of rules which users must agree to before accessing the rest of your content.

How to use enable the tag-me function on your server:
1. First, if you have not done so yet, go into your server channel settings, and restrict `(@everyone)` to have no permissions on your server.
2. Now create a new role which must be allowed base access to your sub. That means a minumum of being able to __Read Text Channels__.
3. Now create 2 seperate channels in a new category. Name the category something along the lines of ***Welcome*** or ***Server Info***. You are going to create a set of rules or a welcome message that your users must agree to or atleast read before unlocking the other channels of your server.
4. One channel is to be an inital welcome page where you will place your created message. This is the only page a user can see before they use the tag-me function, so they are forced to read it! Set this channel's permissions for `(@everyone)` to be: <strong>Read Messages & Read Message History</strong> only.
5.  The other page should be a *command channel*. This is the <strong>tag-me</strong> channel. There should be some information at the bottom of the welcome channel on how to use this channel. `(@everyone)` permissions here must be set as <strong>Read Messages & Send Messages</strong>. Nothing more.
6. When a user calls the tag command from this channel, they will be assigned the role you define in your __pw.env__ file under: __ROLE_TO_ASSIGN__


This bot will store the data of all users who have been previously kicked from the guild through the `warn` command. If a user attempts to use the `tag` command while being in the list of kicked users, they will not be awarded the role.


<br>

## Warning System <a name = "warning"></a>

The warning system works by receiving a `warn` command by an admin of the server, and querying the database for existing user data. You must provide a single argument which is to be in the form of a mention of a username belonging to a user who is currently a member of the guild. Upon calling the command a user will be selected from the database. The user will be given a warning in the form of an embed and will receive a strike.

To warn a user, an admin may use the `warn` command:
```
!warn <@username> <reason for warning>
```

To view a users' warning history, an admin may use the `list` command:
```
!list <@username>
```
This command will display an embed containing a users most recent warning history up to a maximum of 8 warnings. It will display their current strike level (0-2) and their total lifetime strikes. The total lifetime strikes is the total amount of warnings a user has been given in the past. Users may have their current strike level set back to zero by an admin through the use of the `pardon` command.

To remove all strikes from a user, use the `pardon` command:
```
!pardon <@username>
```

All strikes will be removed from the user. The user's lifetime strikes will, ofcourse remain unchanged, and the previous warning reasons will remain visible for an admin to bring up at any time.

To see the history of a user that has been previously kicked from the guild, use the `kicked` command:
```
!kicked <@username>
```

To remove a user from the database of users previously kicked through the `warn` command, you may use the `unkick` command. Upon using this command, the user will be allowed to use the `tag` command once again, thereby granting them access to the rest of your server.
```
!unkick <@username>
```

To access the `help` embed with a list of commands, just send an empty command prefix:
```
!
```
# Example Output<a name="example"></a>
<br>

# Example Output From The Tag-Me Function<a name="example.tag"></a>

### Your __Welcome Page__ should look something like this:
<img src='https://i.imgur.com/p0DNa3j.png'>
<br>

### Before using the `tag` command, no channels are visable to the user:
<img src='https://i.imgur.com/ds7bP7d.png'>
<br>

### After using the `tag` command, the channels appear unlocked to the new user!
<img src='https://i.imgur.com/kS0rY5r.png'>
<br>
<br>

# Example Output From The Warning System<a name="example.warning"></a>

### Example output from the `help` command:
<img src='https://i.imgur.com/wKSxTpE.png'>
<br>

### Example output from the `warn` command:
<img src='https://i.imgur.com/vwSiirj.png'>
<br>

### Example output from the `warn` command when a user has 2 strikes:
<img src='https://i.imgur.com/6wwbZWW.png'>
<br>

### Example output from the `list` command:
<img src='https://i.imgur.com/1vqChHJ.png'>
<br>

### Example output from the `pardon` command:
<img src='https://i.imgur.com/H5BYOKG.png'>