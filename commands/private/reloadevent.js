const { Command } = require('discord-akairo');
class ReloadEventCommand extends Command {
	constructor() {
		super('revt', {
			aliases: ['revt', 'reloadevent', 'eventreload'],
			description: 'Recarga un event handler.',
			ownerOnly: true,
			args: [
				{
					id: 'evento',
					type: 'string',
					prompt: {
						start: 'Ingresa el nombre del event handler',
						time: 10000,
						timeout: "No se recibió respuesta, el comando ha sido cancelado."
					}
				}
			],
		});
	}

	async exec(message, { evento }) {
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

module.exports = ReloadEventCommand;