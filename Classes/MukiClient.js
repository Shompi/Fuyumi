const { Client, Collection } = require('discord.js');
module.exports = class extends Client {
  constructor() {
    super({
      disableMentions: 'everyone',
      partials: ["GUILD_MEMBER", "REACTION", "MESSAGE", "CHANNEL"]
    });

    this.commands = new Collection();
    this.OWNER = '166263335220805634';
    this.SUPPORTGUILD = '537484725896478733';
    this.messages = new Collection();
    this.events = new Collection();
    this.db = require('../LoadDatabase');
  }
}