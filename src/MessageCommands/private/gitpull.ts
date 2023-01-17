import { EmbedBuilder, Message, Colors } from 'discord.js';
import { Command } from 'discord-akairo';
import { promisify } from 'node:util';
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
import { exec } from "node:child_process"

export default class GitPullCommand extends Command {
	constructor() {
		super('gitpull', {
			aliases: ["gitpull", 'pull'],
			description: 'Hace un git pull al respositorio del bot para sicronizar los datos.',
			ownerOnly: true,
		});
	}

	async exec(message: Message) {
		const ExecutePromise = promisify(exec)
		const lastMessage = await message.reply({ content: "🔃 pulling updates..." })

		const { stderr, stdout } = await ExecutePromise('git pull')

		console.log(stdout);
		const embed = new EmbedBuilder()
			.setDescription(stderr || stdout)
			.setColor(Colors.Blue)
			.setTimestamp()

		return lastMessage.edit({
			embeds: [embed]
		})

	}
}