import { Subcommand } from "@sapphire/plugin-subcommands";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, TimestampStyles, TimestampStylesString, codeBlock, time } from "discord.js";
export class UtilityCommands extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'utility',
			subcommands: [
				{
					name: "tiempo",
					chatInputRun: 'chatInputTimestamp',
				}
			]
		})
	}

	registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand(builder => {
			builder.setName('utility')
				.setDescription('Comandos de utilidad')
				.addSubcommand(time =>
					time.setName('tiempo')
						.setDescription('Crea una estampa de tiempo relativa')
						.addIntegerOption(year => year.setName('año').setDescription('El año para esta estampilla').setRequired(true).setMinValue(1).setMaxValue(2500))
						.addIntegerOption(month => month.setName('mes').setDescription('El mes para esta estampilla').setRequired(true).setMinValue(1).setMaxValue(12))
						.addIntegerOption(day => day.setName('dia').setDescription('El dia para esta estampilla').setRequired(true).setMinValue(1).setMaxValue(31))
						.addIntegerOption(hour => hour.setName('hora').setDescription('Hora de la estampilla en formato de 0-24 horas, ex: 0 = 00, 1 = 01').setMinValue(0).setMaxValue(23).setRequired(true))
						.addIntegerOption(minutes => minutes.setName('minutos').setDescription('Los minutos de esta estampilla').setMinValue(0).setMaxValue(59).setRequired(true))
						.addStringOption(type => type.setName('estilo').setDescription('El estilo de esta estampilla').setRequired(true).addChoices(
							{
								name: "Fecha Corta (20/04/2023)",
								value: TimestampStyles.ShortDate,
							},
							{
								name: "Fecha Larga (20 de abril del 2023)",
								value: TimestampStyles.LongDate
							},
							{
								name: "Fecha Larga con Tiempo (20 de abril del 2023 a las 14:30)",
								value: TimestampStyles.LongDateTime
							},
							{
								name: "Tiempo Relativo ('Hace 2 meses') ('En 2 dias')",
								value: TimestampStyles.RelativeTime
							},
						))
				)
		})
	}

	public async chatInputTimestamp(interaction: Subcommand.ChatInputCommandInteraction) {
		const options = {
			year: interaction.options.getInteger('año', true).toString().padStart(4, "0"),
			month: interaction.options.getInteger('mes', true).toString().padStart(2, "0"),
			day: interaction.options.getInteger('dia', true).toString().padStart(2, "0"),
			hour: interaction.options.getInteger('hora', true).toString().padStart(2, '0'),
			minutes: interaction.options.getInteger('minutos', true).toString().padStart(2, '0'),
			style: interaction.options.getString('estilo', true) as TimestampStylesString,
		}

		const date = new Date(`${options.year}-${options.month}-${options.day}T${options.hour}:${options.minutes}:00.000-05:00`)

		const embed = new EmbedBuilder()
			.setDescription(`Timestamp: ${time(date, options.style)}\nFormat: ${codeBlock(time(date, options.style))}`)
			.setColor(Colors.Blue)

		return interaction.reply({ embeds: [embed] })
	}
} 