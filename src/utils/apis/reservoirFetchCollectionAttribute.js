const fetch = require("cross-fetch");

//Define function to call Reservoir API for given CollectionID and diveded by Song attribute and get song floor price
module.exports = async (collectionID) => {

    try {
        let fetchReservoir = await fetch(
            'https://api.reservoir.tools/collections/' + collectionID + '/attributes/explore/v4?attributeKey=Song'
        );
        let fetchedReservoir = await fetchReservoir.json();

        return fetchedReservoir

    } catch (error) {
        console.log(error);
    }
}