const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const { profileGet, bankGet } = require('./helpers/db');
const balConfig = require('../../configs/balance');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			memberName: 'profile',
			aliases: ["perfil"],
			group: 'economy',
			description: 'Tu perfil con Muki, Muki Coins, Exp, Nivel, etc.',
			throttling: {
				duration: 10,
				usages: 1,
			},
		});

		this.onBlock = (message, reason) => null;
		this.onError = (err, message, args, fromPattern) => console.log(err);
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	run({ author, channel }, args) {

		const user_profile = profileGet(author.id);

		/* const description =
			`**Nivel**: ${user_profile.progress.level}` +
			`\n**Experiencia**: ${user_profile.progress.experience} / ${user_profile.progress.expToLevelUp}` +
			`\n**${balConfig.coin_name_short} en mano**: ${user_profile.balance.on_hand}` +
			`\n\n**__Estadisticas__**:` +
			`\n**Mensajes enviados**: ${user_profile.messages_sent}` +
			`\n**Has jugado**: ${user_profile.games_played} veces` +
			`\n**Has ganado**: ${user_profile.games_win} veces` +
			`\n**Has perdido**: ${user_profile.games_lost} veces`; */

		const profileEmbed =
			new MessageEmbed()
				.setTitle(author.tag)
				.setThumbnail(author.displayAvatarURL({ size: 512, dynamic: true }))
				.addFields([
					{
						name: "General",
						value: `Nivel: ${user_profile.progress.level}` +
							`\nExperiencia: \n${user_profile.progress.experience}/ ${user_profile.progress.expToLevelUp}`
					},
					{
						name: "Juegos",
						value: `Has jugado: ${user_profile.games_played} veces` +
							`\nHas ganado: ${user_profile.games_win} veces` +
							`\nHas perdido: ${user_profile.games_lost} veces`,
						inline: true

					},
					{
						name: "Estadisticas",
						value: `Mensajes enviados: ${user_profile.messages_sent}`,
						inline: true

					},
					{
						name: "Balance",
						value: `${balConfig.coin_name_short} en mano: ${user_profile.balance.on_hand}` +
							`\nBonos diarios reclamados: ${user_profile.balance.dailies.claimed}`,
						inline: true
					}
				])
				.setColor("BLUE")
				.setFooter(`Tu cuenta fué registrada en ${new Date(user_profile.date_registered)}`);


		channel.send(profileEmbed);
	}
}