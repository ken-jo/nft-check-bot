const axios = require('axios');
const redis = require('./redis');

async function getCollectionInfo(alias) {
    const slug = await redis.getAlias(alias);
    if (!slug) return;
    let collectionRequest = `https://api.opensea.io/api/v1/collection/${slug}`;
    const collectionInfo = (await axios.get(collectionRequest)).data.collection;
    return collectionInfo;
}

async function getCollectionInfoUsingSlug(slug) {
    
    let collectionRequest = `https://api.opensea.io/api/v1/collection/${slug}`;
    const collectionInfo = (await axios.get(collectionRequest)).data.collection;
    return collectionInfo;
}

// getCollectionInfoUsingSlug('doodles-official').then((result) => {
//     console.log(result.stats)
// })

module.exports = {
    getCollectionInfo,
    getCollectionInfoUsingSlug
}