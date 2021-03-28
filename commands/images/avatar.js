const { MessageEmbed, User, Message } = require('discord.js');
const { Command } = require('discord-akairo');

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



class AvatarCommand extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'avt'],
			description: "Muestra el avatar de un usuario.",
			args: [
				{
					id: 'target',
					type: 'user|string',
					default: (msg, data) => msg.author,
					description: 'Usuario del cual quieres ver el avatar. (default: El autor del mensaje)'
				}
			]
		});
	}

	/**
	 * @param {Message} message 
	 * @param {*} args 
	 */
	async exec(message, { target }) {
		const { channel } = message;
		let embed;

		if (target instanceof User) {
			embed = avatarEmbed(target);
		} else {
			if (isNaN(target)) {
				embed = findUserByName(message, target);
			} else {
				embed = await findUserByID(message, target);
			}
		}

		channel.send(embed);
	}
}

module.exports = AvatarCommand;