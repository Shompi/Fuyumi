const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;
const path = require('path');

const noPrefix = (prefix) => {
  return new MessageEmbed()
    .setTitle("❌ No has especificado un prefijo.")
    .setDescription(`\`${prefix}prefix [nuevoPrefijo]\``)
    .setColor("RED")
}

const limitExceeded = new MessageEmbed()
  .setTitle("❌ El prefijo es demasiado largo.")
  .setColor("RED");

const missingPermissions = (author) => {
  return new MessageEmbed()
    .setTitle(`❌ ¡Lo siento ${author.username}! No tienes permiso para utilizar este comando.`)
    .setColor("RED")
};

const succeed = (prefix) => {
  return new MessageEmbed()
    .setTitle("¡El prefijo se ha cambiado exitosamente!")
    .setDescription(`Nuevo prefijo: \`${prefix}\``)
    .setColor("GREEN");
}

module.exports = {
  name: "prefix",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Cambia mi prefijo en el servidor.",
  usage: "prefix [Nuevo Prefijo]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { guild, channel, member, author } = message;
    const prefix = args.shift();

    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return await channel.send(missingPermissions(author));

    const configs = database.get(guild.id);
    if (!configs) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración.`);

    if (!prefix) return await channel.send(noPrefix(configs.prefix));

    if (prefix.length > 5) return await channel.send(limitExceeded);

    database.set(guild.id, prefix, "prefix");

    return await channel.send(succeed(prefix));
  }
}