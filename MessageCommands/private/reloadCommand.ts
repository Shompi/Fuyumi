import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Fuyumi } from '../../index'

export class ReloadEventCommand extends Command {
	constructor() {
		super('reload', {
			aliases: [],
			description: 'Recarga un commando.',
			ownerOnly: true,
			args: [
				{
					id: 'reload',
					type: 'string',
					prompt: {
						start: 'Ingresa el nombre del comando que quieres recargar:',
						time: 10000,
						timeout: "No se recibió respuesta, el comando ha sido cancelado."
					}
				}
			],
		})
	}

	async exec(message: Message, { command }: { command: string }) {



		return this.client.emit('commandReload', { commandName: command, channelId: message.channel.id, client: message.client })
	}
}