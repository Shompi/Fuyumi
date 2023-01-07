import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			description: 'Recarga un commando.',
			ownerOnly: true,
			args: [
				{
					id: 'command',
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

		return message.client.emit('commandReload', { commandName: command, channelId: message.channel.id, client: message.client })
	}
}
