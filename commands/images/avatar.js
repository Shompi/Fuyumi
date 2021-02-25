const { MessageEmbed, User, MessageMentions } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');


/** @param {User} user*/
const avatarEmbed = (user) =>
	new MessageEmbed()
		.setTitle(`Avatar de ${user.username}`)
		.setDescription(`[PNG](${user.displayAvatarURL({ size: 1024, format: 'png' })}) | [JPEG](${user.displayAvatarURL({ size: 1024, format: 'jpeg' })}) | [GIF](${user.displayAvatarURL({ size: 1024, format: 'gif' })}) | [WEBP](${user.displayAvatarURL({ size: 1024, format: 'webp' })})`)
		.setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
		.setColor('#add8e6')

/**
 * @param {CommandoMessage} message 
 * @param {String} id 
 */
async function findUserByID(message, id) {
	const user = await message.client.users.fetch(id, true).catch(e => null);

	if (!user) return "La ID ingresada no es válida para un usuario de Discord.";
	return avatarEmbed(user);
}

/**
 * @param {CommandoMessage} message 
 * @param {String} name 
 */
function findUserByName(message, name) {
	let membersList = message.guild.members.cache;
	for (let [id, member] of membersList) {
		if (member.displayName === name || member.user.username === name)
			return avatarEmbed(member.user);
	}

	return "No encontré a ningún miembro con ese nombre, intenta usando la mención o la ID.";
}



module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			memberName: 'avatar',
			aliases: [],
			group: 'images',
			description: 'Muestra el avatar de un miembro',
			examples: ["avatar ShompiFlen", "avatar @ShompiFlen"],
			details: "El valor predeterminado será el miembro que ejecuta el comando.",
			args: [
				{
					key: "p",
					type: 'user|string',
					prompt: 'Menciona o ingresa la ID de un miembro:',
					default: (message) => { return message.author },
				}
			]
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	async run(message, { p }) {
		const { channel } = message;
		let embed;

		if (p instanceof User) {
			embed = avatarEmbed(p);
		} else {
			if (isNaN(p)) {
				embed = findUserByName(message, p);
			} else {
				embed = await findUserByID(message, p);
			}
		}

		channel.send(embed);
	}
}