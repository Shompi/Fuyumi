import { Collection, GatewayIntentBits, Guild, Partials } from 'discord.js'
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import { Fuyumi } from '../types'

const { Guilds, GuildBans, GuildEmojisAndStickers, GuildMembers,
	GuildMessages, GuildPresences, DirectMessages, GuildVoiceStates, } = GatewayIntentBits

const enabledPartials = [Partials.Message, Partials.Reaction, Partials.Channel, Partials.User, Partials.GuildMember]

export class FuyumiClient extends AkairoClient {
	commandHandler: CommandHandler
	listenerHandler: ListenerHandler
	commands: Collection<string, Fuyumi.SlashCommand>

	constructor() {
		super({
			// Akairo Client Options
			ownerID: "166263335220805634",
		}, {
			// Discord.js Client Options
			intents: [Guilds, GuildBans, GuildEmojisAndStickers, GuildMembers,
				GuildMessages, GuildPresences, DirectMessages, GuildVoiceStates,],
			partials: enabledPartials,

		})

		this.commandHandler = new CommandHandler(this, {
			// Options for the command handler
			defaultCooldown: 3,
			directory: './src/MessageCommands/',
			prefix: 'f!',
			automateCategories: true,
			extensions: new Set([".js", ".ts"]),
			blockBots: true,
		})

		this.commandHandler.loadAll()

		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/Listeners/',
			extensions: new Set([".js", ".ts"]),
		})

		this.commandHandler.useListenerHandler(this.listenerHandler)
		this.listenerHandler.loadAll()

		// SlashCommands and Context Menu Commands
		this.commands = new Collection()

		// Events

		this.commandHandler.on('load', (command, isReload) => {
			console.log("Message Command loaded => ", command.id, isReload)
		})

	}

	// getters
	get testChannel() {
		return this.channels.cache.get("806268687333457920") ?? null
	}

	get development() {
		return this.guilds.cache.get('941843371062861855') ?? null
	}

	get exiliados() {
		return this.guilds.cache.get("537484725896478733") ?? null
	}
}