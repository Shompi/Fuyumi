const { EmbedBuilder, Message, Colors } = require('discord.js');
const { Command } = require('discord-akairo');
const { promisify } = require('node:util')
const exec = promisify(require('node:child_process').exec);

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
  async exec(message, args) {

    const lastMessage = await message.reply({ content: "🔃 pulling updates..." })

    const { stderr, stdout } = await exec('git pull')

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

module.exports = GitPullCommand;