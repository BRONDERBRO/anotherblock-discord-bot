//Gets content from JSON file
const fs = require('fs');

module.exports = (directory) => {

  let rawdata = fs.readFileSync(directory);
  let jsonData = JSON.parse(rawdata);

  return jsonData;
};
