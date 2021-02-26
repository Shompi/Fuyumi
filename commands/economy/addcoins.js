const { User, MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const { bankAddCoins } = require('./helpers/db');
const balConfig = require('../../Configs/balance');
const Numeral = require('numeral');
module.exports = class AddCoinsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addcoins',
			memberName: 'addcoins',
			group: 'economy',
			description: 'Añade fondos directamente al banco de un usuario.',
			hidden: true,
			ownerOnly: true,
			examples: ["addfounds 1234567890101112 50000"],
			args: [
				{
					key: 'target',
					type: 'user|string',
					prompt: "Menciona o ingresa la ID del usuario al que le quieres añadir fondos:",
					error: "Ocurrió un error con el comando.",
					wait: 10,
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
	async run(message, { target, amount, razon }) {


		let updatedAmount = 0;

		if (target instanceof User) {
			updatedAmount = bankAddCoins(target.id, amount);

		} else {

			target = await this.client.users.fetch(target).catch(e => null);

			if (!target)
				return message.channel.send("❌ La id no es válida para un Usuario de Discord.");

			updatedAmount = bankAddCoins(target.id, amount);
		}


		target.send(new MessageEmbed()
			.setTitle(`¡Has recibido un deposito de ${Numeral(amount).format(0.0)} ${balConfig.coin_name}!`)
			.setDescription(`Mensaje: ${razon}\n\nTienes un total de **${Numeral(updatedAmount).format(0.0)} ${balConfig.coin_name_short}** guardados en tu banco.`)
			.setColor("BLUE")
			.setTimestamp()
		);
	}
}