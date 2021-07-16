const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');


class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			args: [
				{
					id: 'code',
					type: 'string',
				}
			]
		});
	}

	async exec(message, { code }) {

		if (this.client.ownerID !== "166263335220805634") return;
		console.log('EVALED', code);
		const resultEmbed = new MessageEmbed();
		const timestamp = Date.now();
		try {
			let evaled = await eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
				.setDescription(`\`\`\`js\n${clean(evaled)}\`\`\``);

			message.channel.send({ embeds: [resultEmbed] });

		} catch (err) {

			resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
				.setDescription(`\`\`\`js\n${clean(err)}\`\`\``);

			message.channel.send({ embeds: [resultEmbed] });
		}
	}
}


const clean = text => {
	if (typeof (text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}

module.exports = EvalCommand;