const { Command, CommandoMessage } = require('discord.js-commando');
const { profileUpdateDatabase } = require('../economy/helpers/db');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'profileUpdate',
			memberName: 'profileUpdate',
			aliases: [],
			group: 'owner',
			description: 'Actualizar la base de datos de perfiles.',
			ownerOnly: true
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	run(message, args) {
		if (profileUpdateDatabase())
			return console.log("DB ACTUALIZADA");
		else
			return message.react("❌");
	}
}