const { Collection, Intents } = require('discord.js');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');

const { GUILDS, GUILD_BANS, GUILD_EMOJIS_AND_STICKERS, GUILD_MEMBERS,
  GUILD_MESSAGES, GUILD_PRESENCES, DIRECT_MESSAGES, GUILD_VOICE_STATES, } = Intents.FLAGS

module.exports = class Client extends AkairoClient {
  constructor() {
    super({
      // Akairo Client Options
      ownerID: "166263335220805634",
    }, {
      // Discord.js Client Options
      disableMentions: 'everyone',
      intents: [GUILDS, GUILD_BANS, GUILD_EMOJIS_AND_STICKERS, GUILD_MEMBERS,
        GUILD_MESSAGES, GUILD_PRESENCES, DIRECT_MESSAGES, GUILD_VOICE_STATES,],
      partials: ['MESSAGE', 'REACTION', 'USER', 'CHANNEL', 'GUILD_MEMBER'],

    });

    this.commandHandler = new CommandHandler(this, {
      // Options for the command handler
      defaultCooldown: 3,
      directory: './Commands/',
      prefix: 'f!',
      automateCategories: true,
    });

    this.getPrivateChannel = () => this.channels.cache.get("806268687333457920") ?? null;

    this.commandHandler.loadAll();

    this.listenerHandler = new ListenerHandler(this, {
      directory: './Listeners/'
    });

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();

    // SlashCommands and Context Menu Commands
    this.commands = new Collection();

    // AutoComplete

    // Buttons

  }
}