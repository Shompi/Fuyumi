const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

const disabledCommands = (commands) =>
  new MessageEmbed()
    .setTitle(`Lista de comandos desactivados:`)
    .setDescription(commands)
    .setColor("BLUE");

module.exports = {
  name: "disabled",
  filename: path.basename(__filename),
  description: "Muestra los comandos que están desactivados.",
  usage: "disabled <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: ["dis"],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { author, client: Muki, channel } = message;
    if (author.id !== Muki.OWNER) return undefined;

    const commandNames = Muki.commands.filter(c => !c.enabled).map(c => c.name).join("\n");
    console.log(commandNames);

    return await channel.send(disabledCommands(commandNames));
  }
}