import { ButtonBuilder, EmbedBuilder, ChatInputCommandInteraction, Collection, ActionRowBuilder, ButtonStyle, Colors, ComponentType, time, GuildTextBasedChannel } from 'discord.js';

interface FormatOptions {
	name: string
	voters: number
}

function createButtonsFromArray(options: FormatOptions[]) {
	return options.map((_, index) => new ButtonBuilder().setLabel(`VOTAR - ${index + 1}`).setStyle(ButtonStyle.Primary).setCustomId(`poll-option-${index}`));
}

function formatOptions(options: FormatOptions[]) {
	return options.map((option, index) => `**${index + 1}** - ${option.name}`).join("\n");
}

export const Poll = async (interaction: ChatInputCommandInteraction<'cached'>) => {
	// Your code...
	await interaction.deferReply({ ephemeral: true });

	const optionsObject = {
		option_1: interaction.options.getString('opcion_1'),
		option_2: interaction.options.getString('opcion_2'),
		option_3: interaction.options.getString('opcion_3'),
		option_4: interaction.options.getString('opcion_4'),
		option_5: interaction.options.getString('opcion_5'),
	}

	const args = {
		title: interaction.options.getString('titulo') ?? "",
		description: interaction.options.getString('descripcion') ?? "",
		options: Object.values(optionsObject).filter(option => option !== null).map(option => ({ name: option, voters: 0 })) as FormatOptions[],
		// Duration defaults to 5 minutes
		duration: interaction.options.getInteger('duracion') ?? 5,
		channel: interaction.options.getChannel('canal', true) as GuildTextBasedChannel,
	}

	if (!args.channel.permissionsFor(interaction.guild.members.me!).has("SendMessages"))
		return await interaction.editReply({ content: 'No tengo permisos para enviar mensajes en ese canal. Asegúrate de darme los permisos necesarios y usa este comando nuevamente.' });

	const relativeTime = time(Math.round((Date.now() + (args.duration * 1000 * 60)) / 1000), "R");

	const pollEmbed = new EmbedBuilder()
		.setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ size: 128 }) })
		.setTitle(args.title)
		.setDescription(`${args.description}\nLa encuesta terminará en ${relativeTime}`)
		.addFields({
			name: "Opciones", value: formatOptions(args.options)
		})
		.setColor(Colors.Blue);

	const pollMessage = await args.channel.send({
		content: `¡${interaction.user} ha iniciado una votación!`,
		embeds: [pollEmbed],
		components: [new ActionRowBuilder<ButtonBuilder>().addComponents(createButtonsFromArray(args.options))]
	});

	/** @type {Collection<string, {option: number}>} */
	const usersWhoVoted: Collection<string, { option: number; }> = new Collection();

	pollMessage.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: args.duration * 1000 * 60,
	}).on('collect', async (bInteraction) => {

		if (usersWhoVoted.has(bInteraction.user.id))
			await bInteraction.reply({ content: `No puedes volver a votar en esta encuesta.\nHas votado por la opción **${usersWhoVoted.get(bInteraction.user.id)!.option + 1}**`, ephemeral: true });
		else {
			const userVoteNumber = parseInt(bInteraction.customId.charAt(bInteraction.customId.length - 1));
			usersWhoVoted.set(bInteraction.user.id, { option: userVoteNumber });
			args.options[userVoteNumber].voters++;
			await bInteraction.reply({ content: '¡Se ha registrado tu voto exitósamente!', ephemeral: true });
		}
	})
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.on('end', async (_c, _r) => {

			// Actualizar mensaje
			const updatedEmbed = new EmbedBuilder()
				.setTitle(`¡La votación ha finalizado!`)
				.setDescription(`**Resultados**\n\n${args.options.sort((opA, opB) => opB.voters - opA.voters).map((op, i) => `**${i + 1}°** - ${op.name} -> **${op.voters} votos.**`).join("\n")}\nEncuesta terminada: ${relativeTime}}`)
				.setColor(Colors.Green);

			await pollMessage.edit({ content: '¡La votación ha finalizado!', embeds: [updatedEmbed], components: [] });
		});

	await interaction.editReply({ content: `¡Tu encuesta ha sido enviada exitosamente en el canal ${args.channel}!` });
}