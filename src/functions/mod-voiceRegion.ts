import { ChatInputCommandInteraction, EmbedBuilder, Colors } from 'discord.js';


export const ChangeVoiceRegion = async (interaction: ChatInputCommandInteraction) => {

	// This command must be issued on a guild
	// This command must be issued by someone on a voice channel

	if (!interaction.inCachedGuild()) return;

	// We dont need to check for the member permissions since we do that in the main file
	// First check: if the member that issued the command is on a voice channel

	const voiceChannel = interaction.member.voice.channel;

	if (!voiceChannel) return await interaction.reply({
		content: "Debes estar dentro de un canal de voz para usar este comando.",
		ephemeral: true
	});

	const inputRegion = interaction.options.getString('region', false);

	try {

		if (!inputRegion || inputRegion === 'auto')
			await voiceChannel.setRTCRegion(null)
		else
			await voiceChannel.setRTCRegion(inputRegion)


	} catch (e) {

		console.error(e)

		return await interaction.reply({
			content: 'Ocurrió un error al intentar cambiar la región del canal de voz.',
			ephemeral: true
		});
	}

	return await interaction.reply({
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		embeds: [new EmbedBuilder().setColor(Colors.Blue).setDescription(`Se ha cambiado la region de voz del canal **${voiceChannel.name}** a **${inputRegion}**`)]
	});
}