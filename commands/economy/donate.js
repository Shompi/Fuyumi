const { bankDonate, bankGet, profileGet, profileSave } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
const balConfig = require('../../Configs/balance');
const { User } = require('discord.js');
const minAmount = 500;
const { Command } = require('discord-akairo');

class DonateCommand extends Command {
	constructor() {
		super('donate', {
			aliases: ['donate', 'donar', 'dono'],
			description: 'Realiza una donación a otro usuario. La donación se hace directamente desde tu banco hacia el banco del destinatario.',
			cooldown: 10,
			ratelimit: 2,
			args: [
				{
					id: 'target',
					type: 'user',
					prompt: {
						start: "Menciona al miembro al que le quieres donar",
						cancelWord: 'cancelar',
						ended: 'No se recibió un argumento válido, el comando ha sido cancelado.'
					},
					wait: 10,
				},
				{
					id: 'amount',
					type: 'integer',
					prompt: {
						start: `Ingresa la cantidad de ${balConfig.coin_name} que le vas a donar`,
						cancelWord: 'cancelar',
						ended: 'No se recibió un argumento válido, el comando ha sido cancelado.'
					},
				}
			]
		});

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

	exec(message, { target, amount }) {

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

module.exports = DonateCommand;