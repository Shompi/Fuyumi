//@ts-check
const { CommandInteraction, MessageEmbed, GuildMember } = require('discord.js')

/**
 * 
 * @param {CommandInteraction} interaction
 */
const ServerInfo = async (interaction) => {
  const memberList = await interaction.guild.members.fetch().catch(console.error);

  if (!memberList)
    return interaction.reply({
      content: 'No se recibió la lista completa de miembros, por favor intenta usar este comando nuevamente.', ephemeral: true
    });

  let humans = 0;
  let bots = 0;
  for (const [_id, member] of memberList) {
    if (member.user.bot)
      bots += 1;
    else
      humans += 1;
  }
  const serverInfo = new MessageEmbed()
    .setTitle(interaction.guild.name)
    .setDescription(`El dueño actual del servidor es <@${interaction.guild.ownerId}>\nNúmero de roles: ${interaction.guild.roles.cache.size}\nCantidad de canales: ${interaction.guild.channels.cache.size}\nCantidad de miembros actuales: ${memberList.size} (${humans} Humanos, ${bots} Bots)`)
    .setThumbnail(interaction.guild.iconURL({ size: 512, dynamic: true }))
    .setColor(interaction.member instanceof GuildMember ? interaction.member.displayColor : "BLUE")
    .setFooter(`Servidor creado el`)
    .setTimestamp(interaction.guild.createdTimestamp);

  return await interaction.reply({
    embeds: [serverInfo]
  });
}

module.exports = { ServerInfo };