const { Command, CommandoMessage } = require('discord.js-commando');
const balConfig = require('../../configs/balance');
const millis = require('pretty-ms')
const UserProfile = require('../../Classes/UserProfile');
const { profileGet, profileSave } = require('./helpers/db');
const Day = 1000 * 60 * 60 * 22;

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			memberName: 'daily',
			aliases: [],
			group: 'economy',
			description: `¡Reclama tus ${balConfig.bal.coin_name} diarias!`,
			clientPermissions: [],
			examples: ["daily"],
			throttling: {
				duration: 3600,
				usages: 1
			}
		});

		this.onBlock = (message, reason) => null;

		this.isAbleToClaim = (claimed_at) => {

			const diff = Date.now() - (claimed_at * Day);

			return diff < 0 ? false : true;
		}

		/** @param {UserProfile} profile */
		this.updateProfile = (profile) => {
			profile.balance.dailies.claimed_at = Date.now();

			profile.balance.dailies.claimed++;

			profile.balance.dailies.total_earned = profile.balance.dailies.total_earned + balConfig.bal.dailyAmount;

			profile.balance.on_hand = profile.balance.on_hand + balConfig.bal.dailyAmount;

			profileSave(profile.user_id, profile);
		}
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

			this.updateProfile(profile);

			return message.reply(`¡Haz reclamado tus **${balConfig.bal.dailyAmount}** ${balConfig.bal.coin_name} diarias!`);

		} else {
			return message.reply(`¡No puedes reclamar tu bono diario aún!\nDebes esperar \`${millis((profile.balance.dailies.claimed_at + Day) - Date.now())}\` más.`)
		}
	}
}