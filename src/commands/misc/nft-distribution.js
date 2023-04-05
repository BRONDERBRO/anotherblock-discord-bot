const {
    EmbedBuilder,
    ApplicationCommandOptionType
} = require('discord.js');

const createBarChart = require('../../utils/createBarChart');

const readJsonFile = require('../../utils/readJsonFile');

//Require APIs
const reservoirFetchCollectionDistribution = require('../../utils/apis/reservoirFetchCollectionDistribution');

//Get data from nft-distribution options.json file
let options = readJsonFile('src/files/nft-distribution options.json')

module.exports = {
    name: 'nft-distribution',
    description: 'Shows NFT distribution info for specified collection',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,
    options: [{
        name: 'collection',
        description: 'Collection to be searched',
        type: ApplicationCommandOptionType.String,
        //define the parameters that can be passed to the "nft-distribution" command
        choices: options
        ,
        required: true,
    }, ],

    callback: async (client, interaction) => {

        //Get the collectionId introduced in the command by the user
        const collectionId = interaction.options.get('collection').value

        //Get data from drops.json file
        let dataDrops = readJsonFile('src/files/drops.json')

        let collectionIdDrop = null

        //Loop drops.json file to find the collectionName
        const x = dataDrops.drops.length;
        for (let i = 0; i < x; ++i) {

            collectionIdDrop = dataDrops.drops[i].value
            if (collectionIdDrop === collectionId) {

                collectionName = dataDrops.drops[i].name
                break;

            }
        }

        //Build embed
        const chartEmbed = new EmbedBuilder()
            .setTitle('anotherblock collection distribution')
            .setDescription('Distribution of anotherblock collection: ' + collectionName)
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

        let fetchedReservoir = await reservoirFetchCollectionDistribution(collectionId);

        const dataOwnersDistribution = fetchedReservoir.ownersDistribution;

        const chartUrl = createBarChart(dataOwnersDistribution)
        
        //Add image to embed
        chartEmbed.setImage(chartUrl);

        //Sending embed response
        return interaction.reply({
            embeds: [chartEmbed]
        });
    },
};