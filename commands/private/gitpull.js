const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const { spawn } = require('child_process');
const GITPATH = "C:/Program Files/Git/git-cmd.exe"; // Asumiendo que el path siempre será el mismo.
const ARGS = ["git pull && exit"]

class GitPullCommand extends Command {
	constructor() {
		super('gitpull', {
			aliases: ["gitpull", 'pull'],
			description: 'Hace un git pull al respositorio del bot para sicronizar los datos.',
			ownerOnly: true,
		});
	}

	exec(message, args) {
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

module.exports = GitPullCommand;