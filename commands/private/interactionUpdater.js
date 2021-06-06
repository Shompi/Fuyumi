const { Command } = require('discord-akairo');

class InteractionUpdater extends Command {
	constructor() {
		super('updateInteraction', {
			aliases: ['updateInteraction'],
		});
	}

	async exec(message, args) {

	}
}

module.exports = InteractionUpdater;