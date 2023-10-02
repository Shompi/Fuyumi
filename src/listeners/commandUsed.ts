import { User } from 'discord.js';
import { Listener } from '@sapphire/framework';

interface Info {
	commandName: string
	user: User,
	subcommand: string
}

export default class CommandUsed extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
		});
	}
	public run(info: Info) {
		console.log(`Usuario ${info.user.username} usó el comando ${info.commandName}`);
	}
}