import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export class TestCommand extends Command {
	constructor() {
		super('test', {
			aliases: ['test'],
			description: 'Comando de test para probar que el bot responda a los comandos.',
			ownerOnly: true
		});
	}

	exec(message: Message, args: unknown) {
		return message.channel.send('Recargado!');
	}
}