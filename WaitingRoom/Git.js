const { Message, MessageEmbed } = require('discord.js');
const path = require('path');
const { spawn } = require('child_process');
const GITPATH = "C:/Program Files/Git/git-cmd.exe";
const ARGS = ["git pull && exit"]

module.exports = {
  name: "gitpull",
  description: "-",
  aliases: ["pull"],
  filename: path.basename(__filename),
  usage: "gitpull",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  guildOnly: false,

  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
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

