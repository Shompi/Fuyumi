const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spawn } = require('child_process');
const GITPATH = "C:/Program Files/Git/git-cmd.exe"; // Asumiendo que el path siempre será el mismo.
const ARGS = ["git pull && exit"]

module.exports = class GitPull extends Command {
	constructor(client) {
		super(client, {
			name: 'gitpull',
			memberName: 'gitpull',
			aliases: ['gpull'],
			group: 'owner',
			description: 'Hace un git pull al respositorio del bot para sicronizar los datos.',
			examples: [],
			details: "",
			ownerOnly: true,
			hidden: true
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	run(message, args) {
		const cmd = spawn(GITPATH, ARGS);
		let log = "";
		cmd.stdout.on("data", (data) => {
			console.log(`stdout ${data}`);
			log += data.toString();
		});

		cmd.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
			log += data.toString();
			cmd.kill();
		});

		cmd.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			log += `${code}`;
			const logEmbed = new MessageEmbed()
				.setTitle("LOG")
				.setDescription(`\`\`\`${log}\`\`\``)
				.setColor("BLUE");

			message.channel.send("OK!", { embed: logEmbed });
		});
	}
}