const {
  ActivityType
} = require('discord.js');

module.exports = async (client) => {
  //Define different possible bot status
  let status = [{
          name: 'anotherblock music',
      },
      {
          name: 'the NFT markets',
          type: ActivityType.Watching,
      },
      {
          name: 'to anotherblock drops',
          type: ActivityType.Listening,
      },
  ];
  //bot randomely changes status in time intervals of 100 seconds
  setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random]);
  }, 100000);
};