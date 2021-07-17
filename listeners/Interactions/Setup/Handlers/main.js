const { TextChannel } = require("discord.js");
const enmap = require('enmap');
const streamConfigs = new enmap({ name: 'livestreams' });

const defaultStreamConfig = {
	active: false,
	channelID: null,
	goLive: false,
	twitch: false
}


/**
@param {Boolean} toggle Si se están activando o desactivando los mensajes de livestreaming
@param {TextChannel} textChannel
 */
module.exports.LiveStreamings = async (toggle = false, textChannel, guildID) => {

	const configs = streamConfigs.ensure(guildID, defaultStreamConfig);


}