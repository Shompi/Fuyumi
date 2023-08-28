//@ts-check
import keyv from 'keyv'
import { Listener } from 'discord-akairo'
const lastPresence = new keyv("sqlite://db/presence.sqlite", { namespace: 'presence' })
import { ActivityType, Client } from 'discord.js'
const timers: unknown[] = []

export default class ReadyListener extends Listener {
	hasTimers: boolean
	clearTimers: () => void
	setActivity: () => unknown
	sendApiData: () => void
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		})
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

					const activity = (await lastPresence.get('0') ?? { name: '💙 Reviviendo... de a poco...', type: ActivityType.Playing }) as { name: string, type: number }

					this.client.user?.setActivity(activity)
					return
				}, 60_000))
		},

			this.sendApiData = () => {
				setInterval(() => {
					fetch("http://localhost:3000/api/fuyumi", {
						method: 'POST',
						headers: {
							"Content-Type": "application/json",
							"secret-token": "1234"
						},
						body: JSON.stringify({
							guilds: this.client.guilds.cache.map(guild => ({ name: guild.name, member_count: guild.memberCount, iconURL: guild.iconURL({ size: 512 }) ?? "No icon." })),
							avatar: this.client.user?.displayAvatarURL({ size: 512 }),
							uptime: this.client.uptime,
							user_count: this.client.users.cache.size,
							username: this.client.user?.username,
							commands: this.client.application?.commands.cache.map(command => ({ name: command.name, description: command.description }))
						})
					}).then(response => response.json())
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
						.then(data => console.log(data.message))
						.catch(() => null)
				}, 10000)
			}
	}

	exec(client: Client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user!.username}`)
		console.log(`Bot listo: ${Date()}`)

		this.setActivity()
		this.sendApiData()
	}
}