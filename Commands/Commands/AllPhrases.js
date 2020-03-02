//This command will list all join and leave phrases on the guild database.
const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;
const path = require('path');


const phrases = (join = new Array(), leave = new Array(), guild) =>
  new MessageEmbed()
    .setTitle(`Frases de Bienvenida / Salida de la Guild ${guild.name}:`)
    .addFields(
      { name: 'Entrada:', value: `- ${join.join('\n-')}`, inline: false },
      { name: 'Salida:', value: `- ${leave.join('\n-')}`, inline: false }
    )
    .setThumbnail(guild.iconURL({ size: 256 }))
    .setColor("BLUE");


const noAdminRole =
  new MessageEmbed()
    .setTitle(`¡Necesitas un rol de administrador!`)
    .setColor("YELLOW")
    .setDescription(`Un administrador debe configurar un rol de administrador con el comando:\n\`adminrole [@Mencion del rol]\``);

module.exports = {
  name: "wfrases",
  filename: path.basename(__filename),
  description: "Muestra todas las frases de bienvenida configuradas en este servidor.",
  usage: "wfrases <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { member, channel, guild } = message;

    const config = database.get(guild.id);

    if (!config) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración.`);
    const { joinPhrases, leavePhrases } = config.welcome;

    if (member.hasPermission('ADMINISTRATOR', { checkOwner: true })) {
      return await channel.send(phrases(joinPhrases, leavePhrases, guild));

    } else {
      if (!config.adminRole) return await channel.send(noAdminRole);

      if (member.roles.cache.has(adminRole)) {
        return await channel.send(phrases(joinPhrases, leavePhrases, guild));
      } else return await channel.send(noAdminRole);

    }
  }
}