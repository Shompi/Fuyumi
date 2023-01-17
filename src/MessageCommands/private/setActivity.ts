import { Command } from 'discord-akairo';
import keyv from 'keyv';
const lastPresence = new keyv("sqlite://db/presence.sqlite", { namespace: 'presence' })
import { Message, ActivityType } from 'discord.js';

export default class SetActivityCommand extends Command {
	constructor() {
		super('activity', {
			aliases: ['activity', 'setactivity'],
			description: 'Comando para cambiarle el nombre de la actividad al bot',
			ownerOnly: true,
			args: [
				{ type: "string", id: "type" },
				{ type: "string", id: "activity" },
			],
			editable: true
		});
	}

	async exec(message: Message, { type, activity }: { activity: string, type: string }) {

		if (!type || !activity)
			return await message.reply(`Faltaron argumentos para usar este comando: Tipo: ${type} - Actividad: ${activity}`)

		message.client.user.setActivity({
			name: activity,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

			type: ActivityType["Playing"]
		})

		await lastPresence.set('0', { name: activity, type: ActivityType["Playing"] })

		return await message.reply({ content: `La actividad **${type} ${activity}** se ha guardado con éxito.` })
	}
}
