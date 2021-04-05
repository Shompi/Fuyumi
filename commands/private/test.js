const { Command } = require('discord-akairo');
console.log('COMMAND TEST.JS LOADED');

class TestCommand extends Command {
	constructor() {
		super('test', {
			aliases: ['test'],
			description: 'Comando de test para probar que el bot responda a los comandos.',
			ownerOnly: true
		});
	}

	exec(message, args) {
		return message.channel.send('OK!');
	}
}

module.exports = TestCommand;