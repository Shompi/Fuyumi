const { Command } = require('discord-akairo');

class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload', 'reloadcmd'],
			ownerOnly: true,
			args: [{
				id: 'comando',
				type: 'command',
			}]
		});
	}

	async exec(message, { comando }) {
		if (!comando) return message.reply("No se reconoció el comando.");

		comando?.reload();
		return message.reply(`El comando ${comando.id} fué recargado.`);
	}
}

module.exports = ReloadCommand;