# Discord 3 Strike Warning System

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
    - [Prerequisites](#getting_started)
    - [Environment Variables](#env_var)
    - [Installing](#installing)
- [Usage](#usage)
    - [Windows](#windows)
    - [Mac And Linux](#mac-linux)
- [Backing Up Your Data](#backup)
- [Functions And Commands](#functions)
    - [Tag-Me](#tag-me)
    - [Warning System](#warning)


# About <a name = "about"></a>

This Discord bot will scan a set of user defined channels for commands. It only accepts commands from users with administrative roles on your server. It allows for two seperate roles to use the bot. Administrators of the server may call on the bot to give users a *warning* in the form of a message embed. 3 seperate warnings without having been pardoned will result in an instant kick from the server. An administrator can also use the bot to *pardon* a user of their strikes at any time. This pardon function resets strikes to 0.

The bot also comes with a *tag-me* feature which allows you to have a welcome message or landing page for your server. It scans a tag-me channel to assign users a base user role, allowing them access to the rest of your content. If you decide you do not wish to use this feature, you may simply edit the environment variable TAG_ME_CHANNEL to equal a channel name that does not exist within your server.

# Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites <a name = "pres"></a>

This bot runs on [Node.js](https://nodejs.org/en/download/) and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/). 

Once you have Mongo and Node installed on your system, Head on over to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.



1. Click the New Application button to create a new bot.

<img src="https://i.imgur.com/RS7HNEk.png">

2. Give it a name and click create

<img src="https://i.imgur.com/n0lJjsW.png">

3. Navigate to the Bot tab and click Add Bot.

<img src="https://i.imgur.com/N3L6bln.png">

4. Now Click to Reveal Token. You'll need this token to authenticate your bot in the next step.

<img src='https://i.imgur.com/X115w03.png'>

<strong>Never share this token with anyone! It is used to authenticate your bot!</strong> If the password does get leaked, you may simply go back to the Developer Portal on your bot's page and click the button to __*Regnerate*__ or make a new token for your bot. Paste it back into your pw.env file and you will be good to go!

# Environment Variables <a name = "env_var"></a>

This bot is <strong>highly customizable</strong>.
-----
The environment variables listed below are stored in your pw.env file. You will notice a single file that exists within the root directory of this code called __pw.envEXAMPLE.__ Here is where you can customize your bot. The only requirements are that you input the correct token for your bot and ACTIVITY_TYPE is limited to only 3 choices. But other than that, you have a number of variables to choose from to make the bot fit your server's personality a bit more. See below for definitions of what they all mean.


<strong>TOKEN</strong> is taken from the Developer Portal when you created your app.\
<strong>LIMIT_TO_CHANNELS</strong> are the names of the channels you wish the bot to receive commands on. They must be in the form of a comma sperated list for the bot to understand what this variable means.\
<strong>COMMAND_PREFIX</strong> a single character you wish to prefix commands with.\
<strong>ACTIVITY_TYPE</strong> must be set to either PLAYING, LISTENING or WATCHING for the bot to function correctly as defined [here](https://discord.js.org/#/docs/main/stable/typedef/ActivityType). The bot does not allow a user to use STREAMING or CUSTOM_STATUS.\
<strong>ACTIVITY_NAME</strong> displays with the activity type.\
<strong>SET_USERNAME</strong> The username you wish the bot to display.\
<strong>ADMIN_ROLE_NAME</strong> The user role needed to activate the bot.\
<strong>GUEST_ADMIN_ROLE_NAME</strong> A secondary role that can also use the bot.\
<strong>TAG_ME_CHANNEL</strong> The name of the channel for the tag-me function to run on.\
<strong>TAG_COMMAND</strong> The command needed to activate the tag-me function. Should be set to something like 'agree' if you're having your users read rules, or something specific to your sub. A single word command. No arguments.\
<strong>ROLE_TO_ASSIGN</strong> The name of the role given by the tag-me command. This named role is used to grant access to your server. Its purpose is to have your users agree to a set of instructions before being able to continue on.

<strong>If you do not wish to use the tag-me function, simply set the TAG_ME_CHANNEL variable to a channel name that does not exist within your server and the bot will overlook it.</strong>

```
TOKEN='NzY2Mjg4NTk3OTU4NjU2MDIw.X4hL3g.a9lHHyS-blGotkeUwhjgFPQDucA'
LIMIT_TO_CHANNELS="command-channel,general-chat,welcome"
COMMAND_PREFIX="!"
ACTIVITY_TYPE="WATCHING"
ACTIVITY_NAME="you! 👀"
SET_USERNAME="⚾ThreeStrikeBot🤖"
ADMIN_ROLE_NAME="admin"
GUEST_ADMIN_ROLE_NAME="Guest Admin"
TAG_ME_CHANNEL="tag-me"
TAG_COMMAND="agree"
ROLE_TO_ASSIGN="user"
```

# Installing <a name = "installing"></a>

First, you must install Node.js and MongoDB. Official download links for Node can be found [here](https://nodejs.org/en/download/). And MongoDB [here](https://docs.mongodb.com/manual/administration/install-community/).

To check that node and mongo have been installed correctly run these commands:
```
$ node --version
> v12.18.3
$ mongo --version
> v4.4.0
```


After Node and MongoDB are installed, and you have your Application created in the Discord Developer's Portal, download the source code on this page and unzip it.



Before running the app, you must use npm to install the packages needed to run a Discord bot and access the database.

First open your terminal, and cd into the folder containing the source code you just downloaded. Now run this command from within the root folder.
```
$ mkdir database
$ npm i
```

Once these packages are completely installed, you are one step away from being able to run your bot.



# Usage <a name = "usage"></a>

Once all the initial setup of your environment variables is complete, and you've installed the dependencies, you are ready to run the bot! Before running the bot you must have the database running. It is very important that you always run the database from the same location. This is why I have included a simple .bat (for windows users) and .sh (for linux) file for you to run from, which will ensure the consistency of the data.

## Windows <a name = "windows"></a>

Windows users can simply click mongo.bat to run the database server instance in the correct location for the bot to find the files.\
Once mongo is up and running, use run.bat to run the bot.

## Mac and Linux <a name = "mac-linux"></a>

Linux and mac users must use the .sh versions of the files. You must also first set them as executable before using. To do so run these commands:
```
$ sudo chmod +x mongo.sh
$ sudo chmod +x run.sh
```
Now that you've given execute permission on both files, you can use them to run the bot.\
In one terminal window, you will run the database:
```
$ ./mongo.sh
```
In another you will run the bot:
```
$ ./run.sh
```



# Backing Up Your Data <a name = "backup"></a>

It's strongly recommended that you back up your database! That is where all your user data is stored and if anything happens to it, its not going to be a good time for your server. Luckily it's very easy to just copy the database directory from the folder to another and keep it safe. If anything happens to your bot's database, just delete the corrupt one and paste in the backup. It should all work out just fine. <strong>You should also note that you should never attempt this while the database is running. The files will not be correctly copied and will possibly destroy your data.</strong>




# Functions And Commands <a name = "functions"></a>

## Tag-Me <a name = "tag-me"></a>

The tag-me command is used to host a welcome message on your server.\
It allows you to create a set of rules for your users to have to agree to before accessing the rest of your content.

How to use the tag-me function?
1. First, if you have not done so yet, go into your server channel settings, and restrict @everyone to have no permissions.
2. Create a role that can have base access to your sub. That means the ability to <strong>Read Text Channels & See Voice Channels, Send Messages, etc...</strong>
3. Now create 2 seperate channels in a <strong>Server Info</strong> category.
4. One should be an inital welcome page where you can customize your rules/welcome message to say what you like. This is the only page a user can see before they use the tag-me function, so they are forced to read it! Set this pages permissions for @everyone to <strong>Read Messages & Read Message History</strong> only.
5.  The other page should be a *command channel*. This is the <strong>tag-me</strong> channel. There should be some information at the bottom of the welcome channel on how to use this channel. @everyone permissions here must be set as <strong>Read Messages & Send Messages</strong>. Nothing more.
6. When a user calls the tag command from this channel, they will be assigned the role you define in your pw.env file under: ROLE_TO_ASSIGN



## Warning System <a name = "warning"></a>

The warning system works by receiving a warn command by an admin of the server, and querying the database for existing user data. You must provide an @link to a user that is a current member of the guild for the function to proceed. Upon calling the command a user will be selected from the database. The user will be given a warning in the form of an embed and will receive a strike.

To warn a user use this command syntax:
```
!warn @username reason for warning
```

To list a users warning history:
```
!list @username
```

This will display an embed containing the users full warning history and their current number of strikes. The total lifetime strikes is also available, and can be much higher than 3 if they have been given leniency in the past.

To remove all strikes from a user, an admin may call this command:
```
!pardon @username
```

All strikes will be removed from the user. The user's lifetime strikes will, ofcourse remain unchanged, and the previous warning reasons will remain visible for an admin to bring up at any time.

To see the history of a user that has been previously kicked from the guild, use the *kicked* command:
```
!kicked @username
```