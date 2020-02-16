const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;

const noPrefix = (prefix) => {

  const embed = new MessageEmbed()
    .setTitle("❌ No has especificado un prefijo.")
    .setDescription(`${prefix}prefix [nuevoPrefijo]`)
    .setColor("RED")

  return embed;
}

const limitExceeded = new MessageEmbed()
  .setTitle("❌ El prefijo es demasiado largo.")
  .setColor("RED");

const succeed = new MessageEmbed()
  .setTitle("✔ El prefijo se ha cambiado exitosamente!")
  .setColor("GREEN");

/* 
const guildConfig = {
  prefix: "muki!",
  welcome: {
    enabled: false,
    channelID: null,
    joinPhrases: [],
    leavePhrases: []
  }
}
 */

module.exports = async (message = new Message(), prefix) => {
  const { guild, channel } = message;
  const configs = database.get(guild.id);

  if (!configs) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración.`);
  if (!prefix) return await channel.send(noPrefix(configs.prefix));
  if (prefix.length >= 5) return await channel.send(limitExceeded);

  database.set(guild.id, prefix, "prefix");
}