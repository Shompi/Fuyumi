const { Listener } = require('discord-akairo');
const { User } = require('discord.js');


class CommandUsed extends Listener {
  constructor() {
    super('commandUsed', {
      emitter: 'client',
      event: 'commandUsed'
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

module.exports = CommandUsed;