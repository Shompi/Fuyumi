const { Command, CommandoMessage } = require('discord.js-commando');
const { leaderboardWins, leaderboardOnHand, leaderboardNetworth, } = require('./helpers/db');


module.exports = class LeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			memberName: 'leaderboard',
			aliases: ['tabla', 'puntuaciones', 'lb'],
			group: 'economy',
			description: 'Muestra la tabla de puntuaciones de todos los usuarios.',
			examples: ["lb [win | worth |bank] [global]"],
			details: "**win**: Ordena la tabla por n° de juegos ganados.\n**worth**: Ordena la tabla por el total de monedas de los usuarios.\n**bank**: Ordena la tabla por el total de monedas en el banco de cada usuario.\n**global**: y / n, si pasas el valor 'y' se mostrará la tabla global con todos los usuarios.",
			args: [
				{
					key: 'mode',
					type: 'string',
					default: 'worth',
					wait: 10,
					prompt: "Que tipo de ordenamiento quieres realizar:",
					error: 'El argumento ingresado es inválido.',
					oneOf: ["win", "worth", "bank"]
				},
				{
					key: 'global',
					type: 'boolean',
					default: 'true',
					wait: 5,
					error: 'Ocurrió un error con el argumento de filtrado.',
					prompt: "¿Quieres ver la tabla global?",
					default: 'n',
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
	run(message, { mode, global }) {

		let values;

		if (mode === 'win')
			values = leaderboardWins();
		else
			if (mode === 'worth')
				values = leaderboardNetworth();

		if (global) {

		}
	}
}