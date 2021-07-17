const { Message } = require('discord.js');
const { basename } = require('path');
const { profileGet, profileSave } = require('../../commands/economy/helpers/db');
const balanceValues = require('../../configs/balance');


module.exports = {
	name: "messageDelete",
	filename: basename(__filename),
	path: __filename,
	hasTimers: false,
	/**
	*@param {Message} message
	*/
	execute({ author, attachments, content }) {
		/** Restaremos exp y dinero por cada mensaje que sea borrado. */


		const user_profile = profileGet(author.id);

		let coinsAmount = 0;

		// Si el mensaje borrado contenia algun archivo adjunto
		coinsAmount -= (balanceValues.perMessage * attachments.size) - content.length;

		user_profile.balance.on_hand -= coinsAmount;

		profileSave(author.id, user_profile);
	}
}