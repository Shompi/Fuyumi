const { Command } = require('discord-akairo');
const { Message, Emoji } = require('discord.js');

class NewCommand extends Command {
	constructor() {
		super('emoji', {
			aliases: ['emoji'],
			args: [{
				id: 'e',
				type: 'emoji'
			}],

		});
	}

	/**
		@param {Message} message
		@param {Object} object
		@param {Emoji} object.e
	 */
	async exec(message, { e }) {




	}
}
module.exports = NewCommand;