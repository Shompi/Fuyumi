//@ts-check
const { ChatInputCommandInteraction, EmbedBuilder, Role } = require('discord.js');
const { FormatDate } = require('../../../../Helpers/formatDate');

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
module.exports.RoleInfo = async (interaction) => {

  if (interaction.inCachedGuild()) {
  /** @type {Role?} */
  const role = interaction.options.getRole('rol');

  if (!role) // This should never happen though
    return await interaction.reply({ ephemeral: true, content: 'no se recibió el rol correctamente.' });

  const roleAttr = {
    kick: role.permissions.has("KickMembers") ? "Si" : "No",
    ban: role.permissions.has("BanMembers") ? "Si" : "No",
    moderate: role.permissions.has("ModerateMembers") ? "Si" : "No",
    admin: role.permissions.has("Administrator") ? "Si" : "No",
    mentionable: role.mentionable ? "Si" : "No",
    editable: role.editable ? "Si" : "No"
  }

    const embed = new EmbedBuilder()
    .setTitle(`Rol: ${role.name} (${role.id})`)
    .setDescription(`**N° de miembros con este rol**: ${role.members.size}\n**Color (hex)**: ${role.hexColor}\n**Rol creado**: ${FormatDate(role.createdAt)}\n**Icono**: ${role.icon ?? "No tiene"}\n\n**__Permisos__:**\n**Kick**: ${roleAttr.kick}\n**Ban**: ${roleAttr.ban}\n**Moderar**: ${roleAttr.moderate}\n**Es rol de Admin**: ${roleAttr.admin}\n**Mencionable**: ${roleAttr.mentionable}\n**Es editable por mi**: ${roleAttr.editable}`)
    .setColor(role.color)
    .setThumbnail(role.iconURL({ size: 256 }));

  return await interaction.reply({ embeds: [embed] });
  }
}