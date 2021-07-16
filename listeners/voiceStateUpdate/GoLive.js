const { Listener } = require('discord-akairo');
const { VoiceState } = require('discord.js');
const GoLive = require('./helpers/main');

// Constantes de seguridad
const AvailableGuilds = ["537484725896478733"];

class VoiceStateUpdateListener extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			emitter: 'client',
			event: 'voiceStateUpdate'
		});

		this.hasTimers = false;
	}
	/**
	*@param {VoiceState} old
	*@param {VoiceState} now
	*/
	exec(old, now) {
		if (now.member.user.bot) return;

		if (AvailableGuilds.includes(now.guild.id)) {
			GoLive(old, now);
		}
	}
}

module.exports = VoiceStateUpdateListener;