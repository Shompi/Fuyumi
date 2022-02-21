const { MessageEmbed, Message, Util, Formatters } = require('discord.js');
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
  /**
  @param {Message} message */
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

    cmd.on('close', async (code) => {
      console.log(`child process exited with code ${code}`);
      log += `${code}`;
      const logEmbed = new MessageEmbed()
        .setTitle("LOG")
        .setDescription(Formatters.codeBlock(log.slice(0, 3500)))
        .setColor(Util.resolveColor('BLUE'));

      await message.channel.send({ embeds: [logEmbed], content: 'OK' });
    });
  }
}

module.exports = GitPullCommand;