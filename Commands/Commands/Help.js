const { Message, MessageEmbed, Util } = require('discord.js');
const path = require('path');
const database = require('../LoadDatabase').guildConfigs;

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Comando de ayuda.",
  filename: path.basename(__filename),
  nsfw: false,
  enabled: true,
  permissions: [],
  usage: "help (comando)",

  async execute(message = new Message(), args = new Array()) {
    //For now lets just return a message.
    const { client: Muki, guild, channel, author } = message;

    const prefix = database.get(guild.id, "prefix");
    const { commands } = Muki;


    if (args[0]) {
      const command = commands.get(args[0]) || commands.find(c => c.aliases.includes(args[0]));
      if (!command) return channel.send("No encontré un comando con ese nombre.");

      const commandUsage = new MessageEmbed()
        .setTitle(`Comando: ${command.name}`)
        .setDescription(command.description)
        .addField("Modo de uso:", `\`${prefix}${command.usage}\``)
        .setColor("BLUE");

      if (command.name !== 'neko') commandUsage.setFooter(`Aliases: ${command.aliases.join(", ")}`);

      return channel.send(commandUsage);
    }

    let description = "**[OBLIGATORIO] (OPCIONAL) <SIN PARAMETROS>**\n\n";

    commands.forEach(command => {
      description += `\`${prefix}${command.usage}\`\n-${command.description} ${command.nsfw ? '[**NSFW**]' : ""} ${command.enabled ? '' : '[**Este comando está actualmente desactivado.**]'}\n\n`
    });
    const descriptions = Util.splitMessage(description, { char: '\n\n' });
    let embeds = [];

    for (section of descriptions) {
      embeds.push(
        new MessageEmbed()
          .setTitle(`Lista de comandos:`)
          .setDescription(section)
          .setColor("BLUE")
      );
    }
    try {
      for (embed of embeds) {
        await author.send(embed);
      }
      return await message.reply('¡Te he enviado mi lista de comandos por mensaje privado!')
    } catch (e) {
      console.log(e);
      console.log("No puedo mensajear a este usuario.");
      return await message.reply('Al parecer no puedo enviarte mensajes privados, ¿Los tienes desactivados?');
    }
  }
}