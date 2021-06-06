const { MessageEmbed, Guild, User, GuildMember } = require('discord.js');
const { Listener } = require('discord-akairo');
const enmap = require('enmap');
const GuildConfigs = new enmap({ name: 'guildconfigs' });

class GuildMemberRemoveListener extends Listener {
	constructor() {
		super('guildMemberRemove', {
			emitter: 'client',
			event: 'guildMemberRemove'
		});
	}

	/**
		@param {Object} object
		@param {User} object.user El usuario que se ha ido de la guild
		@param {Guild} object.guild La guild de la cual se ha ido el usuario
		*/
	sendLeaveMessage({ user, guild }) {
		const config = GuildConfigs.ensure(guild.id, ConfigTemplate);
	}

	/**@param {GuildMember} member */
	exec(member) {
		/*Code Here*/
		if (!GuildConfigs.has(member.guild.id))
			return;

		sendLeaveMessage({ user: member.user, guild: member.guild });
	}
}

module.exports = GuildMemberRemoveListener;