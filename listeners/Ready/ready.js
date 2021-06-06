const { TextChannel } = require('discord.js');
const fetch = require('node-fetch').default;
const { Listener, AkairoClient } = require('discord-akairo');
const { sendInfoToAPI, sendMemeToAPI } = require('./util/API');
let fetchMemes = true;

const activity = {
	name: "@Muki help",
	type: "LISTENING"
}

/**@type {NodeJS.Timeout[]} */
const timers = [];

console.log("Evento ready iniciado.");
console.log("timers: " + timers.length);

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
		this.hasTimers = true;
		this.clearTimers = () => {
			for (const timer of timers) {
				clearTimeout(timer);
				clearInterval(timer);
				clearImmediate(timer);
				console.log("Timers limpiados.");
			}
		}
	}


	/**@param {AkairoClient} client */
	async exec(client = this.client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user.tag}`);

		try {
			client.user.setPresence({ activity: activity });
			console.log(`Bot listo: ${Date()}`);
		} catch (error) {
			console.log(error);
			client.emit("error", error);
		}

		timers.push(setInterval(() => {
			client.user.setActivity({ name: 'Reviviendo... de a poco...', type: 'PLAYING' });
		}, 10000));
	}
}

module.exports = ReadyListener;