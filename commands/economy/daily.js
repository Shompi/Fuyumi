const { Command, CommandoMessage } = require('discord.js-commando');
const millis = require('pretty-ms')
const balConfig = require('../../configs/balance');
const { profileGet, profileClaimDaily } = require('./helpers/db');
const Day = 1000 * 60 * 60 * 22;
const { numeral } = require('./helpers/customNumeral');

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			memberName: 'daily',
			aliases: [],
			group: 'economy',
			description: `¡Reclama tus ${balConfig.coin_name} diarias!`,
			clientPermissions: [],
			examples: ["daily", "diario"],
			throttling: {
				duration: 3600,
				usages: 1
			}
		});

		this.onBlock = (message, reason) => null;

		this.isAbleToClaim = (claimed_at) => {

			const diff = Date.now() - (claimed_at * Day);
			console.log("CLAIMED_AT", claimed_at);
			console.log("DIFF", diff);
			return diff < 0;
		}

		this.onError = (err, message, args, fromPattern) => console.log(err);
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	run(message, args) {

		const { author } = message;

		const profile = profileGet(author.id);

		if (!profile)
			return message.reply("Ocurrió un error con el comando, ¡lo siento! Por favor intentalo más tarde.");

		if (this.isAbleToClaim(profile.balance.dailies.claimed_at)) {

			const result = profileClaimDaily(profile);

			if (result)
				return message.reply(`¡Haz reclamado tus **${numeral(balConfig.dailyAmount).format('0,0')}** ${balConfig.coin_name} diarias!`);
			else
				return message.reply("Ocurrio un error al intentar reclamar tu bono diario, comunícate con **ShompiFlen#3338** para solucionarlo lo antes posible.");

		} else {
			return message.reply(`¡No puedes reclamar tu bono diario aún!\nDebes esperar \`${millis((profile.balance.dailies.claimed_at + Day) - Date.now())}\` más.`)
		}
	}
}