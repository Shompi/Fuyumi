const { Guild } = require("discord.js");

/**@param {Guild} guild */
module.exports = (guild) => {
	return ({
		id: guild.id,
		welcome: {
			enabled: false,
			join: [],
			leave: [],
		}
	});
}