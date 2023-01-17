import { Listener } from 'discord-akairo';
import { User } from 'discord.js';

interface Info {
	commandName: string
	user: User,
	subcommand: string
}

export default class CommandUsed extends Listener {
	constructor() {
		super('commandUsed', {
			emitter: 'client',
			event: 'commandUsed'
		});
	}

	/**
	 * 
	 * @param {{commandName: string, user: User, subcommand: string}} info 
	 */
	exec(info: Info) {
		console.log(`Usuario ${info.user.tag} usó el comando ${info.commandName}. - ${info.subcommand}`);
	}
}