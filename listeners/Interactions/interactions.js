const { Listener } = require('discord-akairo');
const { Interaction } = require('discord.js');
const { SetupInteraction } = require('./Setup/index');
const { CovidCommand } = require('./Covid/covid')
const { AddRoles } = require('./Buttons/roles');
const { SetModRole } = require('./SetModRole/modRole');
console.log("interaction module loaded");

class InteractionEvent extends Listener {
	constructor() {
		super('interactionCreate', {
			emitter: 'client',
			event: 'interactionCreate'
		});
	}

	/**@param {Interaction} interaction */
	async exec(interaction) {

		if (interaction.isCommand()) {

			const commandname = interaction.commandName;
			if (commandname === 'decir') {
				if (!interaction.options.get('frase'))
					return interaction.reply({ content: "Ocurrió un error con esta interacción.", ephemeral: true });

				interaction.reply(interaction.options.get('frase').value);
			}

			if (commandname === 'covid19') {
				CovidCommand(interaction);
			}

			if (commandname === 'setup') {
				SetupInteraction(interaction);
			}

			if (commandname === 'setmodrole') {
				SetModRole(interaction);
			}
		}


		if (interaction.isButton()) {
			if (interaction.customId.startsWith('role-')) {
				AddRoles(interaction);
			}
		}
	}
}


module.exports = InteractionEvent;