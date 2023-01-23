import dotenv from "dotenv"
dotenv.config()

import { FuyumiClient } from './Classes/Client';
import { readdirSync } from 'fs';
import { Fuyumi } from "./types";
const client = new FuyumiClient();

console.log(__dirname);

/** Cargar los slash commands */
void (async () => {
	const applicationCommandsFiles = readdirSync(__dirname + '/InteractionCommands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));


	for (const filename of applicationCommandsFiles) {

		const command = await import(`./InteractionCommands/${filename}`) as Fuyumi.SlashCommand;

		client.commands.set(command.data.name, command);
	}

	console.log(`Se cargaron ${applicationCommandsFiles.length} slash commands!`);

	void client.login(process.env.BOT_TOKEN)
})()