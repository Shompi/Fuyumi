const { log } = require('console');
const { CommandoMessage } = require('discord.js-commando');
const { basename } = require('path');

module.exports = {
	name: "commandBlock",
	filename: basename(__filename),
	path: __filename,
	hasTimers: true,
	clearTimers() {
		for (const timer of timers) {
			clearTimeout(timer);
			clearInterval(timer);
			clearImmediate(timer);
		}
	},
	/**
	* @param {CommandoMessage} message
	* @param {String} reason La razón de por qué el comando fué bloqueado.
	* @param {Object} data Objeto con información del bloqueo.
	*/
	async execute(message, reason, data) {
		/*Code Here*/
		console.log(`El comando ${message.command.name} fué bloqueado, razón: ${reason}`);
		console.log("DATA:", data);

	}
}