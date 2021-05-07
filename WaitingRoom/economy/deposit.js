const { bankDeposit, profileGet, profileSave } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
const balConfig = require('../../Configs/balance');
const { Command } = require('discord-akairo');

class DepositCommand extends Command {
	constructor() {
		super('deposit', {
			aliases: ['deposit', 'depositar'],
			description: `Deposita tus ${balConfig.coin_name} en tu banco.\nValor por defecto: 'all'`,
			ratelimit: 2,
			cooldown: 10,
			args: [
				{
					id: 'amount',
					type: 'integer',
					otherwise: 'all',
					default: 'all',
				}
			]
		});

	}

	exec(message, { amount }) {

		// Se deposita desde las monedas ON_HAND hacia el banco.

		const user_profile = profileGet(message.author.id);
		let deposited = 0;

		// Primero chequiemos que el usuario tiene dinero en mano
		if (user_profile.balance.on_hand <= 0)
			return message.reply("no tienes dinero en mano suficiente para depositarlo en el banco.");

		if (isNaN(amount) && (amount !== 'all' && amount !== 'todo'))
			return message.reply("Estás usando mal este comando, usa `help deposit` para más detalles");

		if (amount >= user_profile.balance.on_hand || (amount === 'all' || amount === 'todo')) {
			bankDeposit(message.author.id, user_profile.balance.on_hand);
			deposited = user_profile.balance.on_hand;

			user_profile.balance.on_hand = 0; // Depositó todo su dinero.
		} else {
			bankDeposit(message.author.id, amount);
			deposited = amount;

			user_profile.balance.on_hand -= amount;
		}

		profileSave(message.author.id, user_profile);
		return message.reply(`¡Depositaste **${parseNumeral(deposited)} ${balConfig.coin_name}** en tu banco!`);
	}
}

module.exports = DepositCommand;