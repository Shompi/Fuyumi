const { Collection, GatewayIntentBits, Partials } = require('discord.js');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');

const { Guilds, GuildBans, GuildEmojisAndStickers, GuildMembers,
  GuildMessages, GuildPresences, DirectMessages, GuildVoiceStates, } = GatewayIntentBits;

const enabledPartials = [Partials.Message, Partials.Reaction, Partials.Channel, Partials.User, Partials.GuildMember];

module.exports = class FuyumiClient extends AkairoClient {
  constructor() {
    super({
      // Akairo Client Options
      ownerID: "166263335220805634",
    }, {
      // Discord.js Client Options
      disableMentions: 'everyone',
      intents: [Guilds, GuildBans, GuildEmojisAndStickers, GuildMembers,
        GuildMessages, GuildPresences, DirectMessages, GuildVoiceStates,],
      partials: enabledPartials,

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