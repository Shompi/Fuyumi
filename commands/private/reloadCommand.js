const { Command } = require('discord-akairo');

class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload', 'reloadcmd'],
			ownerOnly: true,
			args: [{
				id: 'command',
				type: 'commandAlias',
			}]
		});
	}

	async exec(message, { command }) {
		if (!command) return message.reply("No se reconoció el comando.");

		command?.reload();
		return message.reply(`El comando ${command.id} fué recargado.`);
	}
}

module.exports = ReloadCommand;