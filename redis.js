const redis = require('redis');

const START_WORD = 'START_WORD';
const COMMAND_WORD = 'COMMAND_WORD';
const ALLOW_CHANNEL = 'ALLOW_CHANNEL';
const INIT_START_WORD = '.';
const INIT_COMMAND_WORD = 'op';
const INIT_ALLOW_CHANNEL = JSON.stringify([]);
require('dotenv').config();
const { promisifyAll } = require('bluebird');
promisifyAll(redis);
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT
    },
    username: 'default',
    password: 'pDN2ipve3GBCcvkSwe2FQbYNOZJyJlKu',
});
redisClient.connect();
let isConnect = false;
redisClient.on('connect', () => { console.log('Redis connect ok.'); isConnect = true;});

async function initDiscordServer(clientId) { 
    await redisClient.hSet(clientId, {
        START_WORD: INIT_START_WORD,
        COMMAND_WORD: INIT_COMMAND_WORD,
        ALLOW_CHANNEL: INIT_ALLOW_CHANNEL
    });

    return await getDiscordServer(clientId);
}

async function getDiscordServer(clientId) {
    const data = await redisClient.hmGet(clientId, [START_WORD, COMMAND_WORD, ALLOW_CHANNEL]);
    if (!data[0]) return null;
    const serverInfo = {
        START_WORD: data[0],
        COMMAND_WORD: data[1],
        ALLOW_CHANNEL: data[2],
    }
    return serverInfo;
}

async function setStartWord(clientId, startWord) {
    await redisClient.hSet(clientId, START_WORD, startWord);
}

async function getStartWord(clientId) {
    const data = await redisClient.hGet(clientId, START_WORD);
    return data;
}

async function setCommand(clientId, startWord) {
    await redisClient.hSet(clientId, COMMAND_WORD, startWord);
}

async function getCommand(clientId) {
    const data = await redisClient.hGet(clientId, COMMAND_WORD);
    return data;
}

async function setAllowChannel(clientId, channelId) {
    let channelList = await getAllowChannel(clientId);
    channelList.push(channelId)
    await redisClient.hSet(clientId, ALLOW_CHANNEL, JSON.stringify(channelList));
}

async function getAllowChannel(clientId) {
    const data = await redisClient.hGet(clientId, ALLOW_CHANNEL);
    return data;
}

async function setAlias(alias, slug) {
    await redisClient.set(alias, slug);
}

async function getAlias(alias) {
    const data = await redisClient.get(alias);
    return data;
}

module.exports = {
    START_WORD,
    COMMAND_WORD,
    initDiscordServer,
    getDiscordServer,
    setStartWord,
    getStartWord,
    setAllowChannel,
    getAllowChannel,
    setCommand,
    getCommand,
    setAlias,
    getAlias
}