const { Message, MessageEmbed } = require('discord.js');
const path = require('path');
const database = require('../LoadDatabase').guildConfigs;
module.exports = {
  name: "adminrole",
  guildOnly: true,
  aliases: [],
  filename: path.basename(__filename),
  description: "Configura un rol como Administrador, y autoriza a los miembros con éste a que utilicen mis comandos para administradores.",
  permissions: [],
  nsfw: false,
  enabled: true,
  usage: "adminrole [@Mencion del rol]",

  execute(message = new Message(), args = new Array()) {
    const { mentions, author, guild, channel, member } = message;

    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return channel.send(`Lo siento, este comando solo puede ser ejecutado por un Administrador o el Dueño de la Guild.`);
    const config = database.get(guild.id);

    if (mentions.roles.size === 0) return channel.send(`Debes mencionar un rol!`);

    const role = mentions.roles.first();

    if (role.id === config.adminRole) return channel.send(`El rol ${role.name} ya estaba configurado como rol de Administrador.`);

    if (!guild.roles.cache.has(role.id)) return channel.send(`El rol que has mencionado no es un rol válido, o no se encuentra en esta guild.`);

    config.adminRole = role.id;

    // Update the database configs for this guild.
    database.set(guild.id, config);
    const embed = new MessageEmbed()
      .setTitle(`¡Exito!`)
      .setDescription(`El rol **${role.name}** (ID: **${role.id}**) es ahora el ¡Rol de Administrador!\n\nNota: Esto solo autoriza a los que tengan este rol, a utilizar mis comandos destinados a administradores. No les da ninguna clase de permiso extra en el servidor.`)
      .setColor(role.color);

    return channel.send(embed);
  }
}