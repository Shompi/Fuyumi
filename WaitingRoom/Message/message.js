const { Message } = require('discord.js');
const { basename } = require('path');
const expValues = require('../../configs/experience');
const balValues = require('../../configs/balance');
const { profileGet, profileSave } = require('../../commands/economy/helpers/db');

module.exports = {
	name: "message",
	filename: basename(__filename),
	path: __filename,
	hasTimers: false,
	/**
	*@param {Message} message
	*/
	execute({ author, guild, channel, attachments, client, content }) {
		// Ya que principalmente el evento de mensajes es manejado por discord.js-commando
		// Esta parte será la encargada de dar experiencia y otros checks a los usuarios.

		// Ignoraremos mensajes por DM
		if (!guild)
			return;
		const user_profile = profileGet(author.id);

		let totalExpGain = 0, totalCoinsGain = 0;

		totalExpGain += (attachments.size * expValues.perAttachment) + (content.length) + expValues.perMessage;
		totalCoinsGain += (attachments.size * balValues.perAttachment) + (content.length) + balValues.perMessage;


		if (guild.id === client.exiliados) {

			if (channel.id === "622889689472303120" && attachments.size > 0) // Canal de #memes
				totalExpGain += expValues.perMeme;

			totalExpGain *= expValues.exMultiplier;
			user_profile.progress.experience += totalExpGain;
		}

		user_profile.balance.on_hand += totalCoinsGain;
		user_profile.messages_sent += 1;
		user_profile.balance.earned += totalCoinsGain;

		profileSave(author.id, user_profile);
	}
}

