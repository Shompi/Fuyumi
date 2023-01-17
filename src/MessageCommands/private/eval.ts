import { Command } from 'discord-akairo';
import { EmbedBuilder, Message } from 'discord.js';
import util from "util"

export default class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			args: [
				{
					id: 'code',
					type: 'string',
				},
			],
			ownerOnly: true
		});
	}

	async exec(message: Message, { code }: { code: string }) {

		if (!code || code.length === 0) return;

		const resultEmbed = new EmbedBuilder();
		const timestamp = Date.now();

		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let evaled = await eval(code) as string;

			if (typeof evaled !== "string")
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				evaled = util.inspect(evaled)

			resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
				.setDescription(`\`\`\`js\n${clean(evaled)}\`\`\``);

			await message.channel.send({ embeds: [resultEmbed] });

		} catch (err) {

			resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
				.setDescription(`\`\`\`js\n${clean(err as string)}\`\`\``);

			await message.channel.send({ embeds: [resultEmbed] });
		}
	}
}


const clean = (text: string) => {
	if (typeof (text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}