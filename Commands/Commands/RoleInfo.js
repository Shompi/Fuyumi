const { MessageEmbed, Message } = require('discord.js')


module.exports = async (message = new Message()) => {
  const role = message.mentions.roles.first();
  if (!role) return await message.channel.send('¡No mencionaste ningún rol!\nUso: \`muki!rinfo [Mención de Rol]\`');

  const embed = new MessageEmbed()
    .setTitle(role.name)
    .setDescription(`Miembros que tienen este rol:\n \`\`\`${role.members.map(member => member.displayName).join(', ')}\`\`\``)
    .addField('¿Mencionable?', role.mentionable ? "Si":"No")
    .addField('Cantidad de Miembros:', role.members.size)
    .addField('Color:', `${role.color} (Int) / ${role.hexColor} (Hex)`)
    .addField('Posición', `${role.position} (${message.guild.roles.size - role.position} desde Arriba)`)
    .addField('Creación:', role.createdAt)
    .setColor(role.color)
  
  return await message.channel.send(embed);
}