import { Client } from 'discord.js'

import { Listener } from '@sapphire/framework';
import { UpdateButtons } from '../functions/utils/updateButtons.ts';

const timers: unknown[] = []

export default class ReadyListener extends Listener {
	hasTimers: boolean
	clearTimers: () => void
	setActivity: () => unknown

	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'clientReady'
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