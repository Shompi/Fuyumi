const { CommandInteraction, MessageEmbed, GuildMember } = require('discord.js');
const { FormatDate } = require('../../../../Helpers/formatDate');

/**
 * 
 * @param {GuildMember} member 
 */
function isSomething(member) {

  if (member.id === member.guild.ownerId)
    return "Este miembro es dueño de este servidor"

  if (member.permissions.has('ADMINISTRATOR'))
    return "Este miembro es Administrador de este servidor"

  if (member.permissions.any(["KICK_MEMBERS", "BAN_MEMBERS", "MODERATE_MEMBERS"]))
    return "Este miembro es Moderador de este servidor"

  return " ";
}

/**
 * 
 * @param {CommandInteraction} interaction 
 */
const UserInfo = async (interaction) => {
  const user = interaction.options.getUser('usuario') ?? interaction.user;

  const member = await interaction.guild.members.fetch({ user: user });

  const joinedAt = FormatDate(member.joinedAt);

  const userInfoEmbed = new MessageEmbed()
    .setTitle(`Info de ${member.user.tag}`)
    .setDescription(`Nombre en el servidor: ${member.displayName}\nMiembro desde: ${joinedAt}\nRoles: ${member.roles.cache.size}\nRol más alto: <@&${member.roles.highest.id}>`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
    .setColor(member.displayColor ?? "BLUE")
    .setFooter({ text: isSomething(member) });

  return await interaction.reply({
    embeds: [userInfoEmbed]
  });
}

module.exports = { UserInfo };