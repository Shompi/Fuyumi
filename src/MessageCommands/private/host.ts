import { Command } from 'discord-akairo'
import { type Message, ActivityType, type Snowflake } from 'discord.js'
import keyv from 'keyv'
import { databases } from "../../Configs/dbpaths.json"

const lastpresence = new keyv(databases.last_presence, { namespace: 'presence' })

export default class HostCommand extends Command {
	constructor() {
		super('host', {
			aliases: ['host'],
			ownerOnly: true,
			args: [{
				id: 'targetId',
				type: "string",
			}]
		})
	}

	async exec(message: Message, { targetId }: { targetId: Snowflake }) {

		if (!targetId) {
			return await message.channel.send({ content: 'Te faltó un argumento: `targetId`.' })
		}


		const target = await message.guild?.members.fetch(targetId)

		const userActivity = target?.presence?.activities.find(activity => activity.type === ActivityType.Streaming)

		if (!userActivity) return await message.channel.send({ content: 'No encontre la actividad siendo transmitida por el usuario.' })
		if (userActivity.url === null) {
			return await message.channel.send({ content: 'La actividad no tiene una URL valida.' })
		}
		message.client.user.setActivity({ name: userActivity.name, type: ActivityType.Streaming, url: userActivity.url })

		await lastpresence.set('0', { name: userActivity.name, type: ActivityType.Streaming, url: userActivity.url })

		return
	}
}