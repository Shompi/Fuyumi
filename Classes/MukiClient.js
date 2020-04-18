const { Client, Collection } = require('discord.js');
module.exports = class extends Client {
  constructor(options) {
    super({
      disableMentions: 'everyone',
      partials: ["GUILD_MEMBER"]
    });

    this.commands = new Collection();

    this.events = new Collection();

    this.OWNER = '166263335220805634';
    this.SUPPORTGUILD = '537484725896478733';

    this.Messages = new Collection();

    this.eventhandler = require('../Commands/EventHandlers');

    this.NASA = require('../Commands/NASA/POTD');

    this.config = options;
    this.db = require('../Commands/LoadDatabase');
  }
}