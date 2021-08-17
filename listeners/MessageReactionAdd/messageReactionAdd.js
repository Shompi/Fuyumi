const { Listener, AkairoClient } = require('discord-akairo');
const { TextChannel, MessageReaction, User } = require('discord.js');
const enmap = require('enmap');
const ConteoChistes = new enmap({ name: 'chistemamita' });


/**@type {NodeJS.Timeout[]} */
class MessageReactionAddEvent extends Listener {
	constructor() {
		super('messageReactionAdd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});

		/**
		@param {MessageReaction} reaction
		@param {User} user
		*/
		this.checkChisteMamita = (reaction, user) => {
			if (user.id !== this.client.ownerID || reaction.message.guild?.id !== "537484725896478733") return;

			if (reaction.emoji.name === '🕐') {
				const conteo = ConteoChistes.ensure(reaction.message.author.id, 0) + 1;

				reaction.message.channel.send(`¡${reaction.message.author} ha hecho ${conteo} chiste/s de la mamita!\n<${reaction.message.url}>`);

				ConteoChistes.inc(reaction.message.author.id);
			}

			return;
		}
	}


	/**
	@param {MessageReaction} reaction
	@param {User} user
	*/
	async exec(reaction, user) {
		if (reaction.partial)
			await reaction.fetch();

		if (user.partial)
			await user.fetch();

		/*Code Here*/
		this.checkChisteMamita(reaction, user);
	}
}

console.log('Message Reaction Add loaded!');
module.exports = MessageReactionAddEvent;