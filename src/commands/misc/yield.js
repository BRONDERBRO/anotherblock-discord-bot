const {
    EmbedBuilder
} = require('discord.js');

const readJsonFile = require('../../utils/readJsonFile');

//Require APIs
const reservoirFetchCollection = require('../../utils/apis/reservoirFetchCollection');
const reservoirFetchCollectionAttribute = require('../../utils/apis/reservoirFetchCollectionAttribute');
const coingeckoFetchPrice = require('../../utils/apis/coingeckoFetchPrice');

module.exports = {
    name: 'yield',
    description: 'Shows calculated ADY for current floor values for anotherblock collections',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,

    callback: async (client, interaction) => {

        //Get data from drops.json file
        let dataDrops = readJsonFile('src/files/drops.json')

        //Build embed
        const embed = new EmbedBuilder()
            .setTitle('anotherblock Yield')
            .setDescription('Calculated yield of anotherblock collections')
            .setColor('White')
            //.setImage(client.user.displayAvatarURL())
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setURL('https://market.anotherblock.io/')
            .setAuthor({
                iconURL: client.user.displayAvatarURL(),
                name: client.user.tag
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag
            })

        let collectionId = null
        let collectionName = null
        let collectionTittle = null
        let collectionRoyalties = null
        let collectionInitialPrize = null
        let collectionSong = null
        let floorPrice = null
        let expectedYield = 0
        let tokenID = 'weth'
        
        //Get price of tokenID
        let fetchedCoingecko = await coingeckoFetchPrice(tokenID);
        let ETHPrice = fetchedCoingecko.weth.usd

        //Loop drops.json file to check if the collection has different songs defined
        const x = dataDrops.drops.length;
        for (let i = 0; i < x; ++i) {

            collectionId = dataDrops.drops[i].value
            collectionName = dataDrops.drops[i].name
            collectionTittle = dataDrops.drops[i].tittles

            //If collectionTittle is defined and not null, then the collection has different songs
            if (typeof collectionTittle !== 'undefined' && collectionTittle) {

                let fetchedReservoir = await reservoirFetchCollectionAttribute(collectionId);

                //Loop through the different songs
                const y = fetchedReservoir.attributes.length;
                for (let j = 0; j < y; ++j) {

                    collectionRoyalties = dataDrops.drops[i].tittles[j].royalties
                    collectionInitialPrize = dataDrops.drops[i].tittles[j].initial_price

                    floorPrice = fetchedReservoir.attributes[j].floorAskPrices;

                    collectionSong = fetchedReservoir.attributes[j].value;

                    //If collectionRoyalties is defined and not null, then calculate the expectedYield
                    if (typeof collectionRoyalties !== 'undefined' && collectionRoyalties) {

                        expectedYield = Math.round((collectionRoyalties * collectionInitialPrize) / (floorPrice * ETHPrice) * 10000) / 100

                        //Add fields to the embed with each song
                        embed.addFields({
                            name: collectionSong,
                            value: expectedYield + '%',
                            inline: false,
                        });

                    }
                }

            //If collectionTittle is not defined or null, then the collection does not have different songs
            } else {

                collectionRoyalties = dataDrops.drops[i].royalties
                collectionInitialPrize = dataDrops.drops[i].initial_price

                let fetchedReservoir = await reservoirFetchCollection(collectionId);

                floorPrice = fetchedReservoir.collections[0].floorAsk.price.amount.decimal;

                //If collectionRoyalties is defined and not null, then calculate the expectedYield
                if (typeof collectionRoyalties !== 'undefined' && collectionRoyalties) {

                    expectedYield = Math.round((collectionRoyalties * collectionInitialPrize) / (floorPrice * ETHPrice) * 10000) / 100
                    
                    //Add fields to the embed with each collection
                    embed.addFields({
                        name: collectionName,
                        value: expectedYield + '%',
                        inline: false,
                    });
                }

            }

        }

        //Sending embed response
        return interaction.reply({
            embeds: [embed]
        });

    },
};