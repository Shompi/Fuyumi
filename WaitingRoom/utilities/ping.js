const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

const pingEmbed = (millis, wsPing) => {
	return new MessageEmbed()
		.setTitle(`Latencias:`)
		.setColor("GREEN")
		.addFields(
			{ name: "Enviar y recibir el mensaje:", value: `${millis}ms` },
			{ name: "Websocket:", value: `${wsPing}ms` }
		);
}


module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			memberName: 'ping',
			aliases: [],
			group: 'utilities',
			description: 'Latencia aproximada del bot hacia Discord.',
			examples: [],
			details: "",
			throttling: {
				duration: 60,
				usages: 1
			}
		});

		this.onBlock = (message, reason) => null;
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	async run(message, args) {
		const { channel, client: Muki } = message;
		const wsPing = Muki.ws.ping;

		const now = Date.now();
		const sendedMessage = await channel.send('🏓 Pong!');
		const millis = sendedMessage.createdTimestamp - now;

		return sendedMessage.edit(sendedMessage.content, { embed: pingEmbed(millis, wsPing) });
	}
}
