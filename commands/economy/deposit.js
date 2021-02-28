const { Command, CommandoMessage } = require('discord.js-commando');
const { bankDeposit, profileGet, profileSave } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
const balConfig = require('../../Configs/balance');

module.exports = class DepositCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deposit',
			memberName: 'deposit',
			aliases: ['depositar', 'deposito'],
			group: 'economy',
			description: `Deposita tus ${balConfig.coin_name} en tu banco.\nValor por defecto: 'all'`,
			examples: ["deposit [valor]"],
			throttling: {
				duration: 60,
				usages: 2,
			},
			args: [
				{
					key: 'amount',
					type: 'integer',
					prompt: "Ingresa la cantidad de dinero que quieres depositar en tu banco",
					default: 'all',
					wait: 10,
				}
			]
		});


		this.onBlock = (message, reason) => null;
		this.onError = (err, message, args, fromPattern) => console.log(err);
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	run(message, { amount }) {

		// Se deposita desde las monedas ON_HAND hacia el banco.

		const user_profile = profileGet(message.author.id);
		let deposited = 0;

		if (isNaN(amount) && (amount !== 'all' && amount !== 'todo'))
			return message.reply("Estás usando mal este comando, usa `help deposit` para más detalles");

		// Primero chequiemos que el usuario tiene dinero en mano
		if (user_profile.balance.on_hand <= 0)
			return message.reply("no tienes dinero en mano suficiente para depositarlo en el banco.");

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