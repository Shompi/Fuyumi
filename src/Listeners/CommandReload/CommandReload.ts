import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import fs from "node:fs"
import { Fuyumi } from '@myTypes/index';

export default class CommandUsed extends Listener {
	constructor() {
		super('commandReload', {
			emitter: 'client',
			event: 'commandReload'
		});
	}

	async exec({ commandName, channelId, client }: { commandName: string, channelId: string, client: Fuyumi.Client }) {
		const slashCommandsFiles = fs.readdirSync('./InteractionCommands').filter(file => file.endsWith('.ts'));
		const LogChannel = client.channels.cache.get(channelId) as TextChannel;

		for (const filename of slashCommandsFiles) {
			// Leer el archivo para poder encontrar el comando por su nombre
			const command = await import(`../../InteractionCommands/${filename}`) as Fuyumi.SlashCommand

			console.log(`${commandName} - ${command.data.name}`);


			if (command.data.name === commandName) {

				// Borramos el comando de la colección
				client.commands.delete(commandName);

				const reloadedCommand = await import(`../../InteractionCommands/${filename}`) as Fuyumi.SlashCommand

				// Agregamos el comando a la colección de comandos
				client.commands.set(command.data.name, reloadedCommand);


				return LogChannel.send({ content: `El comando ${commandName} ha sido reiniciado!` });
			}
		}

		return LogChannel.send({ content: 'No se encontró ningún comando con ese nombre.' });
	}
}