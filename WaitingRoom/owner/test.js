const { Command, CommandoMessage } = require('discord.js-commando');

module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'test',
			memberName: 'test',
			aliases: [],
			group: 'owner',
			description: 'Comando de test para probar que el bot responda a los comandos.',
			examples: [],
			details: "",
			hidden: true,
			ownerOnly: true
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	async run(message, args) {
		const { channel } = message;
		return channel.send('OK!');
	}
}