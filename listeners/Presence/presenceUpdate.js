const { Presence } = require('discord.js');
const { Listener } = require('discord-akairo');

class PresenceUpdateListener extends Listener {
	constructor() {
		super('presenceUpdate', {
			emitter: 'client',
			event: 'presenceUpdate'
		});

		this.hasTimers = false;
	}
	/**
	*@param {Presence} old
	*@param {Presence} now
	*/
	exec(old, now) {
		/*Code Here*/
	}
}
module.exports = PresenceUpdateListener;