import dotenv from "dotenv"
dotenv.config()

import { FuyumiClient } from './Classes/Client';
import fs from 'fs';
import { Fuyumi } from "./types";
const client = new FuyumiClient();

/** Cargar los slash commands */
void (async () => {
	const applicationCommandsFiles = fs.readdirSync('./src/InteractionCommands').filter(file => file.endsWith('.ts'));


	for (const filename of applicationCommandsFiles) {

		const command = await import(`./InteractionCommands/${filename}`) as Fuyumi.SlashCommand;

		client.commands.set(command.data.name, command);
	}

	console.log(`Se cargaron ${applicationCommandsFiles.length} slash commands!`);

	void client.login(process.env.BOT_TOKEN)
})()