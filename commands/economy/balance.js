const { MessageEmbed } = require('discord.js');
const balConfig = require('../../configs/balance');
const { bankGet, profileGet } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
const { Command } = require('discord-akairo')

class BalanceCommand extends Command {
	constructor() {
		super('balance', {
			name: 'balance',
			aliases: ['bal']
		});

	}

	exec(message, args) {

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

module.exports = BalanceCommand;