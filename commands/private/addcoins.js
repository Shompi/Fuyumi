const { User, MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const { bankAddCoins, bankSetCoins } = require('../economy/helpers/db');
const balConfig = require('../../Configs/balance');
const { parseNumeral } = require('../economy/helpers/parseNumeral');
const embedImage = "https://puu.sh/HkdOF/c96be264b6.png";

class AddCoinsCommand extends Command {
	constructor() {
		super('addcoins', {
			aliases: ['addcoins'],
			ownerOnly: true,
			args: [
				{
					id: 'target',
					type: 'user|string',
					prompt: {
						start: "Menciona o ingresa la ID del usuario al que le quieres añadir fondos:",
						ended: "El miembro mencionado o la ID ingresada no es válida."
					},
				},
				{
					id: 'operation',
					type: ["-add", "-set"],
					default: "-add",
				},
				{
					id: 'amount',
					type: 'integer',
					prompt: {
						start: "Ingresa la cantidad de monedas:",
						ended: "El comando ha finalizado.",
					}
				},
				{
					id: 'razon',
					type: 'string',
					default: '-'
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
	async exec(message, { target, amount, razon, operation }) {


		let updatedAmount = 0;
		let title = '';

		if (!(target instanceof User)) {
			target = await this.client.users.fetch(target).catch(e => null);

			if (!target)
				return message.channel.send("❌ La id no es válida para un Usuario de Discord.");

		}

		switch (operation) {
			case '-set':
				updatedAmount = bankSetCoins(target.id, amount);
				title = "Tus monedas han sido modificadas.";
				break;

			case '-add':
				updatedAmount = bankAddCoins(target.id, amount);
				title = `¡Has recibido un depósito de ${parseNumeral(amount)} ${balConfig.coin_name}!`;
				break;
		}

		await message.react("✅");

		await target.send(new MessageEmbed()
			.setTitle(title)
			.setDescription(`**Mensaje:** ${razon}\n\nTienes un total de **${parseNumeral(updatedAmount)} ${balConfig.coin_name_short}** guardados en tu banco.`)
			.setColor("BLUE")
			.setThumbnail(embedImage)
			.setTimestamp()
		).catch(() => null);
	}
}

module.exports = AddCoinsCommand;