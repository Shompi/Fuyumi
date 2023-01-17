import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Fuyumi } from '../../types'

export default class ReloadEventCommand extends Command {
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
		})
	}

	async exec(message: Message, { evento }: { evento: Fuyumi.CustomEvent }) {


		if (!evento)
			return await message.channel.send("No encontré un módulo de evento con ese nombre.")

		if (evento.hasTimers)
			evento.clearTimers()

		evento.reload()

		return await message.channel.send(`El evento ${evento.id} fue reiniciado.`)
	}
}
