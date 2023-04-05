const fetch = require("cross-fetch");

//Define function to call Reservoir API for given CollectionID and get collection distribution
module.exports = async (collectionID) => {

    try {
        let fetchReservoir = await fetch(
            'https://api.reservoir.tools/collections/' + collectionID + '/owners-distribution/v1'
        );
        let fetchedReservoir = await fetchReservoir.json();

        return fetchedReservoir

    } catch (error) {
        console.log(error);
    }
}