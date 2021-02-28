const { Command, CommandoMessage } = require('discord.js-commando');
const { bankDonate, bankGet, profileGet, profileSave } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
const balConfig = require('../../Configs/balance');
const { User } = require('discord.js');
const minAmount = 500;

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			memberName: 'donate',
			aliases: ['donar', 'dono'],
			group: 'economy',
			description: 'Realiza una donación a otro usuario. La donación se hace directamente desde tu banco hacia el banco del destinatario.',
			examples: ["donate <@ShompiFlen#3338> <1234>"],
			details: "<REQUERIDO> [OPCIONAL]",
			throttling: {
				usages: 1,
				duration: 10,
			},
			args: [
				{
					key: 'target',
					type: 'user',
					prompt: "Menciona al miembro al que le quieres donar",
					wait: 10,
				},
				{
					key: 'amount',
					type: 'integer',
					prompt: `Ingresa la cantidad de ${balConfig.coin_name} que le vas a donar`,
					wait: 10,
				}
			]
		});

		this.onError = (err, message, args, fromPattern) => console.log(err);
		this.onBlock = (message, reason) => null;


		/**
		 * @param {User} origin 
		 * @param {User} destination 
		 * @param {Number} amount 
		 */
		this.registerDonation = (origin, destination, amount) => {
			const origin_profile = profileGet(origin.id);
			const dest_profile = profileGet(destination.id);


			origin_profile.balance.donations.donated += amount;

			dest_profile.balance.donations.received += amount;
			dest_profile.balance.donations.last_donator.tag = origin.tag;
			dest_profile.balance.donations.last_donator.amount = amount;

			if (dest_profile.balance.donations.top_donator.amount < amount) {
				dest_profile.balance.donations.top_donator.tag = origin.tag;
				dest_profile.balance.donations.top_donator.amount = amount;
			}

			profileSave(origin.id, origin_profile);
			profileSave(destination.id, dest_profile);
		}
	}

	/**
	 * @param { CommandoMessage } message 
	 */
	run(message, { target, amount }) {

		if (message.author.id === target.id)
			return message.reply("No puedes hacerte una donación a ti mismo.");

		if (amount < 500)
			return message.reply(`La cantidad mínima que puedes donar es de **${minAmount} ${balConfig.coin_name}.**`);

		if (bankGet(message.author.id) < amount)
			return message.reply("No tienes los suficientes fondos en tu banco para realizar esta donación.");

		bankDonate(message.author.id, target.id, amount);
		this.registerDonation(message.author, target, amount);

		return message.reply(`¡Has donado **${parseNumeral(amount)}** a ${target} exitósamente! Puedes ver tus fondos restantes usando el comando\`balance\``);
	}
}