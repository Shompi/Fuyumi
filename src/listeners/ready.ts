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
	}

	public run(client: Client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user!.username}`)
		console.log(`Bot listo: ${Date()}`)

		this.setActivity()
		void UpdateButtons(client)
	}

}