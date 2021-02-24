const { TextChannel } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');

const OPERATIONS = ["-add", "-rem", "-set"];

class Config {
	/**@param {TextChannel} channel  */
	constructor(channel) {

	}
}

module.exports = class EnableStreamsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'streams',
			memberName: 'streams',
			aliases: [],
			group: 'moderation',
			description: 'Comando para configurar un canal en el cual se enviarán los livestreams de los miembros.',
			examples: ["streams"],
			details: "Operaciones permitidas: **-add @miembro** - Autoriza a un miembro para que sus Streams se envien al canal.\n**-set #canaldetexto** - Habilita un canal de texto para que se envien las transmisiones.\n**-rem @Miembro - Desautoriza a un miembro para que sus transmisiones no se envien al canal de transmisiones.**",
			args: [
				{
					key: "operation",
					type: 'string',
					prompt: `Ingresa el tipo de operacion que quieres realizar: **${OPERATIONS.join(", ")}**`,
					error: "Ocurrió un error con el comando, para más información sobre como utilizarlo usa **help streams**.",
					wait: 10,
					oneOf: OPERATIONS,
				},
				{
					key: "rest",
					type: 'user|channel',
					infinite: true,
					error: "Ocurrió un error con el comando, para mas información sobre como utilizarlo usa **help streams**.",
					prompt: "",
				}
			],
			userPermissions: ["ADMINISTRATOR"],
			guildOnly: true,
			argsPromptLimit: 0,
		});

		this.onBlock = (message, reason) => null;
		this.onError = (err, message, args, fromPattern) => {
			console.log(message.channel.name);
		}
	}

	/**
	 * @param { CommandoMessage } message 
	 */
	async run(message, { operation, rest }) {
		// TODO.

	}
}