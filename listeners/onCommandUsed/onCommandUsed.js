const { Listener } = require('discord-akairo');
const { User } = require('discord.js');


class onCommandUsed extends Listener {
  constructor() {
    super('onCommandUsed', {
      emitter: 'client',
      event: 'onCommandUsed'
    });
  }

  /**
   * 
   * @param {{commandName: string, user: User, subcommand: string}} info 
   */
  async exec(info) {
    console.log(`Usuario ${info.user.tag} usó el comando ${info.commandName}. - ${info.subcommand}`);
  }
}

module.exports = onCommandUsed;