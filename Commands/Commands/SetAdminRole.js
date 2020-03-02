const { Message, MessageEmbed } = require('discord.js');
const path = require('path');
const database = require('../LoadDatabase').guildConfigs;
module.exports = {
  name: "adminrole",
  aliases: [],
  filename: path.basename(__filename),
  description: "Configura un rol como Administrador, y autoriza a los miembros con éste a que utilicen mis comandos para administradores.",
  permissions: [],
  nsfw: false,
  enabled: true,
  usage: "adminrole [@Mencion del rol]",

  async execute(message = new Message(), args = new Array()) {
    const { mentions, author, guild, channel, member } = message;

    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return await channel.send(`Lo siento, este comando solo puede ser ejecutado por un Administrador o el Dueño de la Guild.`);
    const config = database.get(guild.id);

    if (mentions.roles.size === 0) return await channel.send(`Debes mencionar un rol!`);

    const role = mentions.roles.first();

    if (role.id === config.adminRole) return await channel.send(`El rol ${role.name} ya estaba configurado como rol de Administrador.`);

    if (!guild.roles.cache.has(role.id)) return await channel.send(`El rol que has mencionado no es un rol válido, o no se encuentra en esta guild.`);

    config.adminRole = role.id;

    // Update the database configs for this guild.
    database.set(guild.id, config);

    return await channel.send(`El rol ${role.name} (ID: ${role.id}) es ahora el ¡Rol de Administrador!`);
  }
}