const { Listener } = require('discord-akairo');
const { VoiceState } = require('discord.js');
const GoLive = require('./helpers/main');


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
		GoLive(old, now);
	}
}

module.exports = VoiceStateUpdateListener;