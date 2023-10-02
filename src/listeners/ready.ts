import { ActivityType, Client } from 'discord.js'

import { Listener } from '@sapphire/framework';
import Keyv from 'keyv';
import { UpdateButtons } from '../functions/utils/updateButtons.js';
const BotActivity = new Keyv({ uri: 'sqlite://db/activity.sqlite' })

const timers: unknown[] = []

export default class ReadyListener extends Listener {
	hasTimers: boolean
	clearTimers: () => void
	setActivity: () => unknown
	sendApiData: () => void

	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'ready'
		});

		this.hasTimers = true
		this.clearTimers = () => {
			timers.forEach((timer) => {
				clearTimeout(timer as NodeJS.Timeout)
				clearInterval(timer as NodeJS.Timer)
				timers.shift()
			})
			console.log("Timers limpiados.")
		}

		this.setActivity = () => {

			timers.push(setInterval(
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				async () => {

					const activity = (await BotActivity.get('activity')) as { name: string, type: ActivityType } | null ?? { name: '💙 Reviviendo... de a poco...', type: ActivityType.Playing }

					this.container.client.user?.setActivity(activity)
					return
				}, 60_000))
		}

		this.sendApiData = () => {
			setInterval(() => {
				fetch("http://localhost:3000/api/fuyumi", {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
						"secret-token": "1234"
					},
					body: JSON.stringify({
						guilds: this.container.client.guilds.cache.map(guild => ({ name: guild.name, member_count: guild.memberCount, iconURL: guild.iconURL({ size: 512 }) ?? "No icon." })),
						avatar: this.container.client.user?.displayAvatarURL({ size: 512 }),
						uptime: this.container.client.uptime,
						user_count: this.container.client.users.cache.size,
						username: this.container.client.user?.username,
						commands: this.container.client.application?.commands.cache.map(command => ({ name: command.name, description: command.description }))
					})
				}).then(response => response.json())
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
					.then(data => console.log(data.message))
					.catch(() => null)
			}, 10000)
		}
	}

	public run(client: Client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user!.username}`)
		console.log(`Bot listo: ${Date()}`)

		this.setActivity()
		this.sendApiData()
		void UpdateButtons(client)
	}

}