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
		const event = this.client.listenerHandler.modules.get(evento) ?? null;

		if (!event)
			return message.channel.send("No encontré un módulo de evento con ese nombre.");

		if (event.hasTimers)
			event.clearTimers();

		this.client.listenerHandler.reload(evento);

		return message.channel.send(`El evento ${evento} fue reiniciado.`);
	}
}

module.exports = ReloadEventCommand;