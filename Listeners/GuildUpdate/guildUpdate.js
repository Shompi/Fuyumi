const { Listener } = require('discord-akairo');
const { Guild } = require('discord.js');

class GuildUpdateListener extends Listener {
  constructor() {
    super('guildUpdate', {
      emitter: 'client',
      event: 'guildUpdate'
    });
  }

  /**
   * 
   * @param {Guild} oldGuild 
   * @param {Guild} newGuild 
   */
  async exec(oldGuild, newGuild) {

  }
}

module.exports = GuildUpdateListener;