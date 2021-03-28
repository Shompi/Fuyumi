const { Command } = require('discord-akairo');

class TestCommand extends Command {
	constructor() {
		super('test', {
			name: 'test',
			description: 'Comando de test para probar que el bot responda a los comandos.',
			ownerOnly: true
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	async exec(message, args) {
		const { channel } = message;
		return channel.send('OK!');
	}
}

module.exports = TestCommand;