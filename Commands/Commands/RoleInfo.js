const { MessageEmbed, Message, MessageMentions, Role } = require('discord.js')
const path = require('path');

const noPermissions = () =>
  new MessageEmbed()
    .setTitle("No tienes permiso para usar este comando.")
    .setDescription("`MANAGE_ROLES`")
    .setColor("RED");

const noRole = (usage) =>
  new MessageEmbed()
    .setTitle("❌ ¡No mencionaste ningún rol!")
    .setDescription(`Modo de uso:\n${usage}`)
    .setColor("RED");


const roleInfo = (role, guild) => {
  return new MessageEmbed()
    .setTitle(role.name)
    .setDescription(`Miembros que tienen este rol:\n \`\`\`${role.members.map(member => member.displayName).join(', ')}\`\`\``)
    .addFields(
      { name: 'Mencionable:', value: role.mentionable ? "Si" : "No", inline: false },
      { name: 'Cantidad de Miembros:', value: role.members.size },
      { name: 'Color', value: `${role.color} (Int) / ${role.hexColor} (Hex)` },
      { name: 'Posición:', value: `${role.position} (${guild.roles.cache.size - role.position} desde arriba)` },
      { name: 'Creación:', value: role.createdAt }
    )
    .setColor(role.color);
}

module.exports = {
  name: "role",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Muestra la información general de un <Rol> de este servidor.",
  usage: "role [@Mención de Rol | ID]",
  nsfw: false,
  enabled: true,
  aliases: ['rinfo', 'roleinfo'],
  permissions: ['MANAGE_ROLES'],

  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { channel, mentions, guild, member } = message;

    if (!member.permissions.has("MANAGE_ROLES"))
      return channel.send(noPermissions());

    /**@type {Role | string | null} */
    let role = mentions.roles.first();
    
    if (!role) {
      role = guild.roles.cache.get(args[0]);
      if (!role)
          return channel.send(noRole(this.usage));
    }

    return channel.send(roleInfo(role, guild));
  }
}