import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export async function TimeoutMember(interaction: ChatInputCommandInteraction<"cached">) {
	if (!interaction.guild.members.me?.permissions.has('ModerateMembers')) {
		return await interaction.reply({ content: 'No puedo ejecutar este comando por que me falta el permiso de "MODERAR_MIEMBROS"', ephemeral: true });
	}

	const timeoutSeconds = (interaction.options.getInteger('segundos', false) ?? 60) * 1000;
	const target = interaction.options.getMember('miembro');
	const timeoutReason = interaction.options.getString('razon') ?? "No se especificó una razón.";

	if (target instanceof GuildMember) { // gonna have to take care of the other cases later

		if (target.permissions.has('Administrator'))
			return await interaction.reply({ content: 'No puedes silenciar a este miembro por que tiene permisos de Administrador.', ephemeral: true });

		const muted = await target.timeout(timeoutSeconds, timeoutReason).catch(console.error);

		if (!muted)
			return await interaction.reply({ content: 'No pude silenciar a este miembro.', ephemeral: true });

		await interaction.reply({
			content: `El miembro <@${target.id}> ha sido silenciado con éxito por ${timeoutSeconds / 1000} segundos.`,
			ephemeral: true
		});

	} else {
		return await interaction.reply({ content: 'Ocurrió un error con esta interaccióon.' })
	}
}