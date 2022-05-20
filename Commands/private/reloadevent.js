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
					type: 'listener',
					prompt: {
						start: 'Ingresa el nombre del event listener',
						time: 10000,
						timeout: "No se recibió respuesta, el comando ha sido cancelado."
					}
				}
			],
		});
	}

	async exec(message, { evento }) {


		if (!evento)
			return message.channel.send("No encontré un módulo de evento con ese nombre.");

		if (evento.hasTimers)
			evento.clearTimers();

		evento.reload();

		return message.channel.send(`El evento ${evento.id} fue reiniciado.`);
	}
}

module.exports = ReloadEventCommand;