const { Listener } = require('discord-akairo');
const { Interaction } = require('discord.js');
const { CovidCommand } = require('./responses/index.js');

console.log("interaction module loaded");

class InteractionEvent extends Listener {
	constructor() {
		super('interaction', {
			emitter: 'client',
			event: 'interaction'
		});
	}

	/**@param {Interaction} interaction */
	async exec(interaction) {

		if (interaction.isCommand()) {

			const commandname = interaction.commandName;
			console.log(commandname);
			if (commandname === 'decir') {
				interaction.reply(interaction.options[0].value);
			}

			if (commandname === 'covid19') {
				CovidCommand(interaction);
			}
		}
	}
}


module.exports = InteractionEvent;