//@ts-check
import keyv from 'keyv'
import { Listener } from 'discord-akairo'
const lastPresence = new keyv("sqlite://db/presence.sqlite", { namespace: 'presence' })
import { type Activity, ActivityType } from 'discord.js'
import { Fuyumi } from '@myTypes/index'

const timers: unknown[] = []

export default class ReadyListener extends Listener {
	hasTimers: boolean
	clearTimers: () => void
	setActivity: () => unknown
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
		}
	}

	exec(client: Fuyumi.Client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user!.username}`)
		console.log(`Bot listo: ${Date()}`)

		this.setActivity()
		console.log("Startup complete!")
		client.emit("deployServer", client)
	}
}