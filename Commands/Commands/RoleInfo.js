const { MessageEmbed, Message, MessageMentions } = require('discord.js')
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


const roleInfo = (role, guild) =>
  new MessageEmbed()
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

module.exports = {
  name: "role",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Muestra la información general de un <Rol> de este servidor.",
  usage: "role [@Mención de Rol]",
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

    const role = mentions.roles.first() || args[0];

    if (!role || MessageMentions.ROLES_PATTERN.test(args[0])) return channel.send(noRole(this.usage));

    return channel.send(roleInfo(role, guild));
  }
}