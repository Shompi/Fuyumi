const { CommandInteraction } = require('discord.js');
const { LiveStreamings } = require('./Handlers/main');

/**
 * @param {CommandInteraction} interaction
*/

module.exports.SetupInteraction = async (interaction) => {
	/**
	option[0] = livestreaming
	option[0].option[0] = livestreaming -> toggle
	option[0].option[1] = livestreaming -> channel (chequear que sea un canal de texto.);
	 */

	console.log('setup interaction');
	const subcommand = interaction.options.get('livestreaming');

	if (subcommand) {

	}
}