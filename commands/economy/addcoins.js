const { User, MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const { bankAddCoins, bankSetCoins } = require('./helpers/db');
const balConfig = require('../../Configs/balance');
const { parseNumeral } = require('./helpers/parseNumeral');
const embedImage = "https://puu.sh/HkdOF/c96be264b6.png";

module.exports = class AddCoinsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addcoins',
			memberName: 'addcoins',
			group: 'economy',
			description: 'Añade fondos directamente al banco de un usuario.',
			hidden: true,
			ownerOnly: true,
			examples: ["addcoins <@ShompiFlen> [-set | -add] <50000> [Razón]"],
			args: [
				{
					key: 'target',
					type: 'user|string',
					prompt: "Menciona o ingresa la ID del usuario al que le quieres añadir fondos:",
					error: "Ocurrió un error con el comando.",
					wait: 10,
				},
				{
					key: 'operation',
					type: 'string',
					prompt: "Ingresa la operacion que quieres realizar.",
					error: "Ocurrió un error con el comando.",
					wait: 10,
					oneOf: ["-set", "-add"]
				},
				{
					key: 'amount',
					type: 'integer',
					prompt: "Cantidad de Muki Coins que le quieres depositar:",
					error: "Ocurrió un error con el comando.",
					wait: 10,
				},
				{
					key: 'razon',
					type: 'string',
					infinite: true,
					prompt: "Ingresa una razón para este depósito.",
					error: "Ocurrió un error con el comando.",
					wait: 30,
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
	async run(message, { target, amount, razon, operation }) {


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