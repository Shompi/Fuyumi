const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const { profileGet, bankGet } = require('./helpers/db');
const balConfig = require('../../configs/balance');
const { parseNumeral } = require('./helpers/parseNumeral');
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
		const profileEmbed =
			new MessageEmbed()
				.setTitle(author.tag)
				.setThumbnail(author.displayAvatarURL({ size: 512, dynamic: true }))
				.setDescription(
					`**Nivel:** ${user_profile.progress.level}\t**XP:** ${user_profile.progress.experience} / ${user_profile.progress.expToLevelUp}` +
					`\n\n**Partidas:**\nTotal: ${user_profile.games_played}\nGanadas: ${user_profile.games_win}\nPerdidas: ${user_profile.games_lost}` +
					`\n\n**Donaciones:**\nHas Donado: ${parseNumeral(user_profile.balance.donations.donated) ?? '0'} ${balConfig.coin_name_short}\nTe han Donado: ${parseNumeral(user_profile.balance.donations.received) ?? '0'} ${balConfig.coin_name_short}` +
					`\nTu Top Donador: ${user_profile.balance.donations.top_donator.tag ?? 'No has recibido donaciones.'} ${user_profile.balance.donations.top_donator.amount ? `${parseNumeral(user_profile.balance.donations.top_donator.amount)} ${balConfig.coin_name_short}` : ''}` +
					`\nÚltima donación recibida: ${user_profile.balance.donations.last_donator.tag ?? 'No has recibido donaciones.'} ${user_profile.balance.donations.last_donator.amount ? `${parseNumeral(user_profile.balance.donations.last_donator.amount)} ${balConfig.coin_name_short}` : ''}` +
					`\n\n**Robos:**\nHas Robado: ${parseNumeral(user_profile.balance.stolen_from_others)}\nTe han Robado: ${parseNumeral(user_profile.balance.stolen_by_others)}` +
					`\n\n**Diarios:**\nReclamados: ${user_profile.balance.dailies.claimed}\n Total de ${balConfig.coin_name_short}: ${parseNumeral(user_profile.balance.dailies.total_earned)}`
				)
				.setColor("BLUE")
				.setFooter(`Has conseguido ${parseNumeral(user_profile.balance.earned)} desde`)
				.setTimestamp(user_profile.date_registered);

		channel.send(profileEmbed);
	}
}