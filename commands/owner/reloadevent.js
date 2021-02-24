const { Message } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'revt',
			memberName: 'reloadevent',
			aliases: ['reloadevent', 'eventreload'],
			group: 'owner',
			description: 'Recarga un event handler.',
			hidden: true,
			ownerOnly: true,
			args: [
				{
					key: 'evento',
					prompt: "Ingresa el nombre del evento:",
					type: 'string'
				}
			],
			argsPromptLimit: 0
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	async run(message, { evento }) {
		const { channel } = message;

		const event = this.client.events.get(evento);

		if (!event)
			return channel.send("No hay un evento registrado con ese nombre.");

		//Si se encuentra el evento:
		//Checkear si el evento contiene timers:
		if (event.hasTimers)
			event.clearTimers();

		delete require.cache[require.resolve(event.path)];

		try {
			const reload = require(event.path);

			// Borrar desde el set de eventos
			this.client.events.delete(event.name);

			// Agregarlo de nuevo a la Collection
			this.client.events.set(reload.name, reload);

			return channel.send(`El evento **${reload.name}** ha sido reiniciado.`);

		} catch (error) {
			console.log(error);
		}
	}
}