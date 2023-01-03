import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, Colors, User } from 'discord.js';
import { FormatDate } from '../Helpers/formatDate';

export const UserInfo = async (interaction: ChatInputCommandInteraction) => {

	const user = interaction.options.getMember('usuario') ?? interaction.options.getString('id', false) ?? interaction.user;

	if (user instanceof GuildMember) {

		return await interaction.reply({
			embeds: [getMemberInfo(user)]
		});

	} else if (user instanceof User) {
		const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });
		return await interaction.reply({
			embeds: [getUserInfo(fetchedUser)]
		})
	} else if (typeof user === "string") {
		const fetchedUser = await interaction.client.users.fetch(user, { force: true });
		return await interaction.reply({
			embeds: [getUserInfo(fetchedUser)]
		})
	}
}

function getUserInfo(user: User) {
	return new EmbedBuilder()
		.setTitle(user.tag)
		.setThumbnail(user.displayAvatarURL({ size: 512 }))
		.setDescription(`**Creación de la cuenta**: ${FormatDate(user.createdAt)}\n**Color personalizado**: ${user.accentColor} (${user.hexAccentColor})\n**¿Bot?**: ${user.bot ? "Si" : "No"}`)
		.setColor(Colors.Blue)
}

function getMemberInfo(member: GuildMember) {

	const joinedAt = FormatDate(member.joinedAt);

	return new EmbedBuilder()
		.setTitle(`Info de ${member.user.tag}`)
		.setDescription(`**Nombre en el servidor**: ${member.displayName}\n**Miembro desde**: ${joinedAt}\n**Roles**: ${member.roles.cache.size}\n**Rol más alto**: <@&${member.roles.highest.id}>\n**¿Bot?**: ${member.user.bot ? "Si" : "No"}`)
		.setThumbnail(member.user.displayAvatarURL({ size: 512 }))
		.setColor(member.displayColor ?? Colors.Blue)
		.setFooter({ text: isSomething(member) });
}

function isSomething(member: GuildMember) {

	if (member.id === member.guild.ownerId)
		return "Este miembro es dueño de este servidor"

	if (member.permissions.has("Administrator"))
		return "Este miembro es Administrador de este servidor"

	if (member.permissions.any(["KickMembers", "BanMembers", "ModerateMembers"]))
		return "Este miembro es Moderador de este servidor"

	return " ";
}