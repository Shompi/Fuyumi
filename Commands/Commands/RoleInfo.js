const { MessageEmbed, Message } = require('discord.js')

const noRole =
  new MessageEmbed()
    .setTitle("❌ ¡No mencionaste ningún rol!")
    .setColor("RED");


const roleInfo = (role, guild) =>
  new MessageEmbed()
    .setTitle(role.name)
    .setDescription(`Miembros que tienen este rol:\n \`\`\`${role.members.map(member => member.displayName).join(', ')}\`\`\``)
    .addField('¿Mencionable?', role.mentionable ? "Si" : "No")
    .addField('Cantidad de Miembros:', role.members.size)
    .addField('Color:', `${role.color} (Int) / ${role.hexColor} (Hex)`)
    .addField('Posición', `${role.position} (${guild.roles.size - role.position} desde Arriba)`)
    .addField('Creación:', role.createdAt)
    .setColor(role.color);

module.exports = {
  name: "roleinfo",
  description: "Muestra información general de un <Rol> de este servidor.",
  usage: "roleinfo [@Mención de Rol]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { channel, mentions, guild } = message;
    const role = mentions.roles.first();
    if (!role) return await channel.send(noRole);

    return await channel.send(roleInfo(role, guild));
  }
}