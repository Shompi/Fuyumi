//@ts-check
import { ChatInputCommandInteraction, EmbedBuilder, Role } from 'discord.js';
import { FormatDate } from '../Helpers/formatDate';

export const RoleInfo = async (interaction: ChatInputCommandInteraction) => {

	if (interaction.inCachedGuild()) {

		const role = interaction.options.getRole('rol', true);

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