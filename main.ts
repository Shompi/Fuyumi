import dotenv from "dotenv"
dotenv.config()

import Client from './Classes/Client';
import fs from 'fs';
const client = new Client();

/** Cargar los slash commands */
(async () => {
	const applicationCommandsFiles = fs.readdirSync('./InteractionCommands').filter(file => file.endsWith('.ts'));


for (const filename of applicationCommandsFiles) {

	const command = await import(`./InteractionCommands/${filename}`);

	client.commands.set(command.data.name, command);
}

console.log(`Se cargaron ${applicationCommandsFiles.length} slash commands!`);

client.login(process.env.BOT_TOKEN)
})()