# nft-check-bot

A discord bot for tracking of collections floor, volume....(NFT status) using opensea data  

## Discord NFT Floor Bot for Opensea collections

A discord bot for keeping track of your opensea collections floor prices.

## Usage

To Invite the bot to your server, use the [Discord invite link](https://discord.com/oauth2/authorize?client_id=1005705705069756466&permissions=274877933568&scope=bot).

To get the current channels nft status (see mapping in index.js, if other projects are needed setup the bot for your own, see below) , use the command: \
`.op` \
To get specific collection floor prices in any channels, use the command: \
`.op <collection-alias>` \
If you want to search a collection by registering your own keywords, use the command: \
`.op save gen https://opensea.io/collection/gene-sis-the-girls-of-armament` \
or \
`.op save gen gene-sis-the-girls-of-armament` \
You can use own your language.

### Admin

If you have administrator privileges, you can change the startup keywords and commands. \
Please refer to help for more details.

## Self Hosting

If you would like to host the bot yourself, first set up a Discord bot through the Discord Developer portal and add the token to the .env file (DISCORD_TOKEN). Also, we use redis for storing reserved words. You need to write the redis server address and port in .env file. Next, pull this repository onto your local machine: \
`git clone <git_url>` \
Open the .env file, and imput your API key in the correct space. \
Next, ensure that you have NodeJS and NPM installed and run: \
`npm install` \
`node .` \
If you want to be just a little bit more advanced, I suggest you to use pm2 for your bot. If you want to run your bot with load balanced instances, you can use the command: \
`pm2 start index.js -i 4` \
Congratulations! You now have a running Discord floor price bot. \

## Tip/Donation

If you want to say thank you, you can find me on Twitter @yangbok_. \
If the Ethereum network is your way to go, here is my tip wallet address: 0xkenzo.eth

This bot is inspired by https://github.com/luxcode007/Discord-Opensea-NFT-Floor-Bot
