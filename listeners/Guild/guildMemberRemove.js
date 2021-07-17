const { MessageEmbed, Guild, User, GuildMember, DiscordAPIError, Collection } = require('discord.js');
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
	/**@param {{msg: string, avatar: string, desc: string}} */
	buildLeaveEmbed({ msg, avatar, desc }) {
		return new MessageEmbed()
			.setTitle(message)
			.setDescription(desc)
			.setColor('RED')
			.setThumbnail(avatar)
			.setTimestamp();
	}

	/**
	@param {{user:User, guild: Guild}} object 
		*/
	sendLeaveMessage({ user, guild }) {
		/**
		@type {
			{
				welcome: {
					enabled: boolean,
					join: [],
					leave: [],
					channelID: string, 
				}
			}
		} */
		const config = GuildConfigs.ensure(guild.id, ConfigTemplate);

		if (config.welcome.enabled && guild.channels.cache.has(config.welcome.channelID)) {
			/**@type {[string]} */
			const leavePhrases = config.welcome.leave;
			let msg = `${user.tag} ha abandonado ${guild.name}!`;
			let desc = '';
			if (leavePhrases.length > 0) {
				desc = leavePhrases[Math.floor(Math.random() * leavePhrases.length)];
			}

			return guild.channels.cache.get(config.welcome.channelID)?.send(buildLeaveEmbed({
				msg: msg,
				desc: desc,
				avatar: user.displayAvatarURL()
			}));
		}
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