const { Command, CommandoMessage } = require('discord.js-commando');
const { bankDonate, bankGet } = require('./helpers/db');
const { parseNumeral } = require('./helpers/parseNumeral');
const balConfig = require('../../Configs/balance');
const minAmount = 500;

module.exports = class extends Command {
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
					error: "Ocurrió un error con el comando.",
					wait: 10,
				},
				{
					key: 'amount',
					type: 'integer',
					prompt: `Ingresa la cantidad de ${balConfig.coin_name} que le vas a donar`,
					error: "Ocurrió un error con el comando.",
					wait: 10,
				}
			]
		});

		this.onError = (err, message, args, fromPattern) => console.log(err);
		this.onBlock = (message, reason) => null;
	}

	/**
	 * @param { CommandoMessage } message 
	 */
	run(message, { target, amount }) {

		if (amount < 500)
			return message.reply(`La cantidad mínima que puedes donar es de **${minAmount} ${balConfig.coin_name}.**`);

		if (bankGet(message.author.id) < amount)
			return message.reply("No tienes los suficientes fondos en tu banco para realizar esta donación.");

		bankDonate(message.author.id, target.id, amount);

		return message.reply(`¡Has donado **${parseNumeral(amount)}** a ${target} exitósamente! Puedes ver tus fondos restantes usando el comando\`balance\``);
	}
}