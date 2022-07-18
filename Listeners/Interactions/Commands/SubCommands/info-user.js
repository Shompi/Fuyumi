//@ts-check
const { ChatInputCommandInteraction, EmbedBuilder, GuildMember, User, Colors } = require('discord.js');
const { FormatDate } = require('../../../../Helpers/formatDate');

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
const UserInfo = async (interaction) => {

  const user = interaction.options.getMember('usuario') ?? interaction.options.getString('id', false) ?? interaction.user;

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
  return new EmbedBuilder()
    .setTitle(user.tag)
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
    .setDescription(`Creación de la cuenta: ${FormatDate(user.createdAt)}\nColor personalizado: ${user.accentColor} (${user.hexAccentColor})\n¿Bot?: ${user.bot ? "Si" : "No"}`)
    .setColor(Colors.Blue)
}

/**
 * 
 * @param {GuildMember} member 
 * @returns 
 */

function getMemberInfo(member) {

  const joinedAt = FormatDate(member.joinedAt);

  return new EmbedBuilder()
    .setTitle(`Info de ${member.user.tag}`)
    .setDescription(`Nombre en el servidor: ${member.displayName}\nMiembro desde: ${joinedAt}\nRoles: ${member.roles.cache.size}\nRol más alto: <@&${member.roles.highest.id}>`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setColor(member.displayColor ?? Colors.Blue)
    .setFooter({ text: isSomething(member) });
}

/**
 * 
 * @param {GuildMember} member 
 */
function isSomething(member) {

  if (member.id === member.guild.ownerId)
    return "Este miembro es dueño de este servidor"

  if (member.permissions.has("Administrator"))
    return "Este miembro es Administrador de este servidor"

  if (member.permissions.any(["KickMembers", "BanMembers", "ModerateMembers"]))
    return "Este miembro es Moderador de este servidor"

  return " ";
}

module.exports = { UserInfo };