const { Command } = require('discord-akairo');
const { profileUpdateDatabase } = require('../economy/helpers/db');

class ProfileUpdateCommand extends Command {
	constructor(client) {
		super('profileUpdate', {
			aliases: ['profileUpdate', 'updateProfiles'],
			description: 'Actualizar la base de datos de perfiles.',
			ownerOnly: true,
		});
	}
	exec(message, args) {
		if (profileUpdateDatabase())
			return console.log("DB ACTUALIZADA");
		else
			return message.react("❌");
	}
}

module.exports = ProfileUpdateCommand;