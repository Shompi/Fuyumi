const { MessageEmbed, Message } = require('discord.js')
const path = require('path');

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

  async execute(message = new Message(), args = new Array()) {
    const { channel, mentions, guild } = message;
    const role = mentions.roles.first();
    if (!role) return channel.send(noRole(this.usage));

    return channel.send(roleInfo(role, guild));
  }
}