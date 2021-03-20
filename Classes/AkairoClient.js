const { AkairoClient, CommandHandler } = require('discord-akairo');
module.exports = class MukiClient extends AkairoClient {
	constructor() {
		super({
			// Akairo Client Options
			ownerID: "166263335220805634",
		}, {
			// Discord.js Client Options
			disableMentions: 'everyone',
		});

		this.commandHandler = new CommandHandler(this, {
			// Options for the command handler
			defaultCooldown: 3,
			directory: './commands/',
			prefix: 'muki!',
			automateCategories: true,
		});

		this.commandHandler.loadAll();
	}
}