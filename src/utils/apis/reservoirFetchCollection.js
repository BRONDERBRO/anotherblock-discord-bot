const fetch = require("cross-fetch");

//Define function to call Reservoir API for given CollectionID and get collection floor price
module.exports = async (collectionID) => {

    try {
        let fetchReservoir = await fetch(
            'https://api.reservoir.tools/collections/v5?id=' + collectionID + '&sortBy=createdAt'
        );
        let fetchedReservoir = await fetchReservoir.json();

        return fetchedReservoir;
        
    } catch (error) {
        console.log(error);
    }
}