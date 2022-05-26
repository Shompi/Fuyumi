const { CommandInteraction, MessageEmbed, GuildMember, User, Util } = require('discord.js');
const { FormatDate } = require('../../../../Helpers/formatDate');

/**
 * 
 * @param {CommandInteraction} interaction 
 */
const UserInfo = async (interaction) => {
  const user = interaction.options.getMember('usuario', false) ?? interaction.options.getString('id', false) ?? interaction.member ?? interaction.user;

  if (user instanceof GuildMember) {

    return await interaction.reply({
      embeds: [getMemberInfo(user)]
    });

  } else if (!isNaN(Number(user))) {

    const fetchedUser = await interaction.client.users.fetch(user, { force: true });

    return await interaction.reply({
      embeds: [getUserInfo(fetchedUser)]
    })
  }
}

/**
 * 
 * @param {User} user 
 */
function getUserInfo(user) {
  return new MessageEmbed()
    .setTitle(user.tag)
    .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
    .setDescription(`Creación de la cuenta: ${FormatDate(user.createdAt)}\nColor personalizado: ${user.accentColor} (${user.hexAccentColor})\n¿Bot?: ${user.bot ? "Si" : "No"}`)
    .setColor(Util.resolveColor('BLUE'))
}

/**
 * 
 * @param {GuildMember} member 
 * @returns 
 */

function getMemberInfo(member) {

  const joinedAt = FormatDate(member.joinedAt);

  return new MessageEmbed()
    .setTitle(`Info de ${member.user.tag}`)
    .setDescription(`Nombre en el servidor: ${member.displayName}\nMiembro desde: ${joinedAt}\nRoles: ${member.roles.cache.size}\nRol más alto: <@&${member.roles.highest.id}>`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
    .setColor(member.displayColor ?? Util.resolveColor("BLUE"))
    .setFooter({ text: isSomething(member) });
}

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

module.exports = { UserInfo };