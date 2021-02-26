const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const balConfig = require('../../configs/balance');
const { bankGet, profileGet } = require('./helpers/db');

module.exports = class BalanceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'balance',
			memberName: 'balance',
			aliases: ['bal'],
			group: 'economy',
			description: 'Revisa tu situación economica, donaciones, robos, etc.',
			throttling: {
				duration: 10,
				usages: 1
			}
		});

		this.onError = (err, message, args, fromPattern) => console.log(err);
		this.onBlock = (message, reason) => null;
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	run(message, args) {

		const { balance } = profileGet(message.author.id);

		const description =
			`${balConfig.coin_code} en Mano: ${balance.on_hand}` +
			`\n${balConfig.coin_code} en el Banco: ${bankGet(message.author.id)}` +
			`\n\n**__Donaciones__**` +
			`\n${balConfig.coin_name_short} Donados: ${balance.donations.donated}` +
			`\n${balConfig.coin_name_short} Recibidos: ${balance.donations.received}` +
			`\nTop Donador: ${balance.donations.top_donator.tag ?? 'No ha recibido donaciones.'} ${balance.donations.top_donator.amount ? `donó **${balance.donations.top_donator.amount} ${balConfig.coin_name_short}**` : ''}` +
			`\nÚltimo Donador: ${balance.donations.last_donator}` +
			`\n\n**__Robos__**` +
			`\nTe han robado: ${balance.stolen_by_others} ${balConfig.coin_name_short}` +
			`\nHas robado: ${balance.stolen_from_others} ${balConfig.coin_name_short}` +
			`\n\n¡Has conseguido **${balance.earned} ${balConfig.coin_name}** en total!`;

		const balanceEmbed =
			new MessageEmbed()
				.setAuthor("Balance")
				.setTitle(message.author.tag)
				.setColor("BLUE")
				.setDescription(description)
				.setThumbnail(message.author.displayAvatarURL({ size: 512, dynamic: true }));

		message.channel.send(balanceEmbed);
	}
}