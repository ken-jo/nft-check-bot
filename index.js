'use strict';

// Add required libs
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });

const opensea = require('./opensea');
const redisClient = require('./redis');

// Load .env file
require('dotenv').config();

// Debug when bot is loaded
client.once('ready', () => {
    console.debug('Floor Bot loaded!')
});

function sendSaveRequest (channelId, data) {
    try {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'YANGBOK BOT', iconURL: 'https://pbs.twimg.com/profile_images/1506553780372140035/BNCJwRml_400x400.jpg', url: `https://mobile.twitter.com/yangbok_` })
            .addFields(
                { name: 'Search fail.', value: `[${data}] 검색이 되지 않습니다.\n명령어를 다시 입력하거나 저장해주세요.`},
                { name: 'How to save alias', value: ` 1) .op save 메콩 meta-kongz-official\n또는\n 2) .op save 메콩 https://opensea.io/collection/meta-kongz-official`},
            )
            .setTimestamp()
            .setFooter({ text: 'TW: @yangbok_', iconURL: 'https://lh3.googleusercontent.com/5Wz4HiDNExCEJozLkfMrvhVAnUR7xLYkpf69pETliFEM6yt68DhGHGtIkOcwv31JExvIGBkCTnv8d9WgpAET9TpzVbYM_5OwyrwyZA=w600' });
    
        (client.channels.cache.get(channelId)).send({embeds: [exampleEmbed]});

    } catch (err) {
        console.log(err);
    }
}
function sendHelpInfo (channelId) {
    try {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'YANGBOK BOT', iconURL: 'https://pbs.twimg.com/profile_images/1506553780372140035/BNCJwRml_400x400.jpg', url: `https://mobile.twitter.com/yangbok_` })
            .setDescription(`How to use?`)
            .addFields(
                { name: 'Starting Command', value: ` . : start command word\n op : command word\n {alias} : search target`},
                { name: 'Starting Command Example', value: ` .op 메콩`},
                { name: '-------------------------------------', value: '-------------------------------------'},
                { name: 'Study Command', value: ` save : save alias target nft`},
                { name: 'Study Command Example', value: ` 1) .op save 메콩 meta-kongz-official\n또는\n 2) .op save 메콩 https://opensea.io/collection/meta-kongz-official`},
                { name: '-------------------------------------', value: '-------------------------------------'},
                { name: 'Admin Command', value: ` change_start : change start command word\n change_command : change command word\n reset_property : reset server setting`},
                { name: 'Admin Command Example', value: ` 1) .op change_start #\n 2) #op change_command 옾\n 3) #옾 reset_property`},
            )
            .setTimestamp()
            .setFooter({ text: 'TW: @yangbok_', iconURL: 'https://lh3.googleusercontent.com/5Wz4HiDNExCEJozLkfMrvhVAnUR7xLYkpf69pETliFEM6yt68DhGHGtIkOcwv31JExvIGBkCTnv8d9WgpAET9TpzVbYM_5OwyrwyZA=w600' });
    
        (client.channels.cache.get(channelId)).send({embeds: [exampleEmbed]});

    } catch (err) {
        console.log(err);
    }
}

function sendOpenseaInfo (channelId, data) {
    try {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(data.name)
            .setURL(`https://opensea.io/collection/${data.slug}`)
            .setAuthor({ name: 'YANGBOK BOT', iconURL: 'https://pbs.twimg.com/profile_images/1506553780372140035/BNCJwRml_400x400.jpg', url: `https://mobile.twitter.com/yangbok_` })
            .setDescription(`[Discord](${data.discord_url} '${data.discord_url}') | [Twitter](https://twitter.com/${data.twitter_username} 'https://twitter.com/${data.twitter_username}') | [Homepage](${data.external_url} '${data.external_url}')`)
            .setThumbnail(data.image_url)
            .addFields(
                { name: 'Floor price', value: ` ${data.stats.floor_price}`, inline: true },
                { name: 'Today volume', value: ` ${data.stats.one_day_volume.toFixed(3)}`, inline: true },
                { name: 'Today sales', value: ` ${data.stats.one_day_sales}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'TW: @yangbok_', iconURL: 'https://lh3.googleusercontent.com/5Wz4HiDNExCEJozLkfMrvhVAnUR7xLYkpf69pETliFEM6yt68DhGHGtIkOcwv31JExvIGBkCTnv8d9WgpAET9TpzVbYM_5OwyrwyZA=w600' });
    
        (client.channels.cache.get(channelId)).send({embeds: [exampleEmbed]});
 
    } catch (err) {
        console.log(err);
    }
}

client.on('interactionCreate', async interaction => {
    console.log(client.commands.get(interaction));
});

const commandStr = {
    CHANGE_START_WORD: 'change_start',
    CHANGE_COMMAND_WORD: 'change_command',
    SAVE_ALIAS: 'save',
    HELP: 'help',
    RESET: 'reset_property'
}

var url = require('url');
function makeSlug(word) {
    const target = url.parse(word);
    const targetSplit = target.pathname.split('/');
    return targetSplit[targetSplit.length-1];
}
client.on('messageCreate', async (message) => {
    try {
        console.log(`${message.author.username}#${message.author.discriminator} /`, message.content);
        if(message.author.bot) return;
        let server = message.guild.id; // ID of the guild the message was sent in
        let channel = message.channel.id; // ID of the channel the message was sent in
        let serverInfo = await redisClient.getDiscordServer(server);
        let isAdmin = false;
        try{
            isAdmin = message.member.permissions.has(PermissionsBitField.Flags.ManageRoles); // 커멘드 변경 가능하게 수정
            console.log(isAdmin);
        } catch (err) {
            console.log(err);
        }
        if (!serverInfo) {
            serverInfo = await redisClient.initDiscordServer(server);
        }
        const commandPrefix = `${serverInfo.START_WORD}${serverInfo.COMMAND_WORD}`;
        if (message.content.startsWith(commandPrefix)) {
            let args = message.content.slice(commandPrefix.length + 1).trim().split(' ');
            if (args[0] == commandStr.SAVE_ALIAS) {
                const slug = makeSlug(args[2]);
                console.log(args[2], slug);
                const data = await opensea.getCollectionInfoUsingSlug(slug);
                if (data) {
                    redisClient.setAlias(args[1], slug);
                    message.channel.send('Saved'); 
                } else {
                    console.log(args[2], 'error');
                }
                return;
            } else if (args[0] == commandStr.CHANGE_START_WORD) {
                if (isAdmin) {
                    redisClient.setStartWord(server, args[1]);
                    message.channel.send('Changed');
                }
            } else if (args[0] == commandStr.CHANGE_COMMAND_WORD) {
                if (isAdmin) {
                    redisClient.setCommand(server, args[1]);
                    message.channel.send('Changed');
                }
            } else if (args[0] == commandStr.RESET) {
                if (isAdmin) {
                    redisClient.initDiscordServer(server);
                    message.channel.send('Changed');
                }
            } else if (args[0] == commandStr.HELP) {
                sendHelpInfo(channel);
            } else {
                const data = await opensea.getCollectionInfo(args[0]);
                if (data) {
                    sendOpenseaInfo(channel, data);
                } else {
                    sendSaveRequest(channel, args[0]);
                }
            }
        }

    } catch (err) {
        console.log(err); 
    }
});
// Bot login via Discord token from .env
client.login(process.env.DISCORD_TOKEN);