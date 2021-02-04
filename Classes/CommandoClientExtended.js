const { CommandoClient } = require('discord.js-commando');
const { Collection } = require('discord.js');

module.exports = class ExtendedClient extends CommandoClient {
  constructor() {
    super(
      {
        owner: "166263335220805634",
        disableMentions: "everyone",
        partials: ["CHANNEL", "MESSAGE", "REACTION", "USER"],
        commandPrefix: 'muki!',
        commandEditableDuration: 60,
        nonCommandEditable: false
      }
    )

    this.events = new Collection();
    this.db = require('../LoadDatabase');
  }
}