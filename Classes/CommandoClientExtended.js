const { CommandoClient } = require('discord.js-commando');
const { Collection } = require('discord.js');
module.exports = class ExtendedClient extends CommandoClient {
	constructor() {
		super(
			{
				disableMentions: "everyone",
				partials: ["CHANNEL", "MESSAGE", "REACTION", "USER"],
				commandPrefix: 'muki!',
				commandEditableDuration: 60,
				nonCommandEditable: true,
				ws: {
					intents: ["GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILDS", "GUILD_PRESENCES",
						"GUILD_EMOJIS", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGE_REACTIONS"],
				},
				owner: "166263335220805634",
			}
		)
		this.exiliados = "537484725896478733";
		this.events = new Collection();
		this.database = require('../loadEnmaps');
	}
}