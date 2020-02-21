//This command will list all join and leave phrases on the guild database.
const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;

const phrases = (join = new Array(), leave = new Array(), guild) =>
  new MessageEmbed()
    .setTitle(`Frases de Bienvenida / Salida de la Guild ${guild.name}:`)
    .addField("Entrada:", "-" + join.join("\n-"))
    .addField("Salida:", "-" + leave.join("\n-"))
    .setThumbnail(guild.iconURL({ size: 256 }))
    .setColor("BLUE");


module.exports = {
  execute: async (message = new Message(), content) => {
    const { member, channel, guild } = message;

    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return undefined;

    const config = database.get(guild.id);
    if (!config) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración.`);

    const { joinPhrases, leavePhrases } = config.welcome;

    return await channel.send(phrases(joinPhrases, leavePhrases, guild));
  }
}