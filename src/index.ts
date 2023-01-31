import dotenv from "dotenv"
dotenv.config()

import { readdirSync } from 'fs';
import { Fuyumi } from "@myTypes/index";

import { Collection, GatewayIntentBits, Partials } from 'discord.js'
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'

const { Guilds, GuildBans, GuildEmojisAndStickers, GuildMembers,
	GuildMessages, GuildPresences, DirectMessages, GuildVoiceStates, } = GatewayIntentBits

const enabledPartials = [Partials.Message, Partials.Reaction, Partials.Channel, Partials.User, Partials.GuildMember]

export class FuyumiClient extends AkairoClient {
	commandHandler: CommandHandler
	listenerHandler: ListenerHandler
	commands: Collection<string, Fuyumi.SlashCommandTemplate>

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
			directory: __dirname + '/MessageCommands/',
			prefix: 'f!',
			automateCategories: true,
			extensions: new Set([".js", ".ts"]),
			blockBots: true,
		})

		this.commandHandler.loadAll()

		this.listenerHandler = new ListenerHandler(this, {
			directory: __dirname + '/Listeners/',
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


const client = new FuyumiClient();

/** Cargar los slash commands */
void (async () => {
	const applicationCommandsFiles = readdirSync(__dirname + '/InteractionCommands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));


	for (const filename of applicationCommandsFiles) {

		const command = (await import(`./InteractionCommands/${filename}`)) as Fuyumi.SlashCommandTemplate

		client.commands.set(command.data.name, command);
	}

	console.log(`Se cargaron ${applicationCommandsFiles.length} slash commands!`);

	void client.login(process.env.BOT_TOKEN)
})()