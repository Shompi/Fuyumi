const { Collection } = require('discord.js');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
module.exports = class MukiClient extends AkairoClient {
	constructor() {
		super({
			// Akairo Client Options
			ownerID: "166263335220805634",
		}, {
			// Discord.js Client Options
			disableMentions: 'everyone',
			intents: ['GUILDS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS'
			],
			partials: ['MESSAGE', 'REACTION', 'USER', 'CHANNEL', 'GUILD_MEMBER']
		});

		this.commandHandler = new CommandHandler(this, {
			// Options for the command handler
			defaultCooldown: 3,
      directory: './Commands/',
			prefix: 'muki!',
			automateCategories: true,
		});

		this.commandHandler.loadAll();

		this.listenerHandler = new ListenerHandler(this, {
      directory: './Listeners/'
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();

    // SlashCommands
    this.commands = new Collection();

    // ContextMenus
    this.contextCommands = new Collection();

    // AutoComplete

    // Buttons

	}
}