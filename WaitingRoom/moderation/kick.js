const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed, GuildMember } = require('discord.js');

const targetMessage = (obj) => {
	const { reason, guild } = obj;

	return new MessageEmbed()
		.setTitle(`Has sido expulsado de la guild ${guild.name}`)
		.setDescription(`${reason ? reason : "-"}`)
		.setThumbnail(guild.iconURL)
		.setColor("RED");
}

module.exports = class KickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			memberName: 'kick',
			aliases: [],
			group: 'moderation',
			description: 'Expulsa a miembro del Servidor.',
			clientPermissions: ["KICK_MEMBERS"],
			userPermissions: ["KICK_MEMBERS"],
			examples: ["kick @Somebody#0000"],
			guildOnly: true,
			args: [
				{
					key: 'miembro',
					type: 'member|string',
					prompt: "Menciona la miembro que quieres expulsar:",
					error: "Ocurrió un error.",
					wait: 10
				},
				{
					key: 'reason',
					type: 'string',
					max: 350,
					default: 'Razón no especificada.',
					error: "Asegúrate de que la razón no sobrepase los 350 caracteres.",
					prompt: "Ingresa una razón para la expulsión."
				}
			],
			argsPromptLimit: 0,
			format: "<@Miembro|ID> [Razón (opcional)]"
		});

		this.usage = () => `\`${this.client.commandPrefix}${this.name} ${this.format}\` o \`${this.client.user} ${this.name} ${this.format}\``;

		this.onError = (err, message, args, fromPattern) => {
			message.reply("Ocurrió un error con el comando.");
			console.log(err);
		}

		this.onBlock = (message, reason) => null;

		/** 
		* @param { GuildMember } target
		*/
		this.checkMemberKickable = (target) => {
			let kickable = true;
			let message = "";

			if (!target) {
				message = "No encontré a ningún miembro con esa id.";
				kickable = false;
			}
			else if (target.id === this.client.user.id) {
				message = `¡No me expulsaré yo mismo!`;
				kickable = false;
			}

			else if (target.permissions.has(['KICK_MEMBERS', 'BAN_MEMBERS'], true)) {
				message = "No puedo expulsar a este miembro.";
				kickable = false;
			}

			else if (!target.kickable) {
				message = "Este miembro no es expulsable por mi.";
				kickable = false;
			}

			return {
				kickable: kickable,
				reason: message
			}
		}

		/**
		* @param {GuildMember} target
		* @param {CommandoMessage} message
		*/

		this.kickMember = async (target, message) => {
			try {

				await target.kick(reason)
				message.reply(`El miembro **${miembro.user.tag}** fué expulsado con éxito del Servidor.`);

			} catch (e) {

				message.reply(`Ocurrió un error al intentar expulsar al miembro.`);
				console.error(e);

			}
		}
	}

	/**
	 * @param { CommandoMessage } message  
	 */
	async run(message, { miembro, reason }) {
		const { channel, guild } = message;

		let target;

		if (miembro instanceof GuildMember) {
			target = miembro;

		} else {
			// Si member es de tipo string / ID
			if (isNaN(miembro))
				return message.reply("La ID del miembro debe ser una ID numérica.");
			// Esto sera un GuildMember o undefined (console.error : undefined);
			target = await guild.members.fetch({ user: miembro }).catch(e => console.error(e));
		}

		const isKickable = this.checkMemberKickable(target);

		if (isKickable.kickable)
			return this.kickMember(target, message);
		else
			message.reply(isKickable.reason);
	}
}
