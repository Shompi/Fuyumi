const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

class ReloadCommand extends Command {
  constructor() {
    super('reload', {
      aliases: ['reload', 'reloadcmd'],
      ownerOnly: true,
      args: [{
        id: 'comando',
        type: "string",
      }]
    });
  }


  /** @param {Message} message */
  async exec(message, { comando }) {

    message.client.emit("commandReload", { commandName: comando, channelId: message.channel.id });
  }
}

module.exports = ReloadCommand;