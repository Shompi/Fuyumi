const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const balConfig = require('../../configs/balance');
const { bankGet, profileGet } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
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

		const balanceEmbed =
			new MessageEmbed()
				.setAuthor("Balance")
				.setTitle(message.author.tag)
				.setColor("BLUE")
				.setDescription(
					`**${balConfig.coin_name} en mano:** ${parseNumeral(balance.on_hand)}` +
					`\n**${balConfig.coin_name} en banco:** ${parseNumeral(bankGet(message.author.id))}`
				)
				.setThumbnail(message.author.displayAvatarURL({ size: 512, dynamic: true }));

		message.channel.send(balanceEmbed);
	}
}