import { Colors, EmbedBuilder } from "discord.js";
import { Command } from "@sapphire/framework"

const PossibleAnswers = [
	"Si.", "No.", "Tal vez.", "Quizás.", "Probablemente.",
	"Definitivamente no.", "Pronto.",
	"Por supuesto.", "Pregúntame de nuevo más tarde.",
	"Ya sabes la respuesta.", "Estoy bastante seguro de eso.",
	"Eso suena horrible.",
	"Hasta una ardilla ciega encuentra una nuez.",
	"Así como lo veo, si.", "No cuentes con ello.",
	"No me preguntes a mi, solo soy una bola."
]

export class EightBall extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('8ball')
				.setDescription('Preguntale lo que quieras a la bola 8')
				.setDescriptionLocalization("en-US", "Ask whatever you want to the 8 ball")
				.addStringOption(question =>
					question.setName('pregunta')
						.setDescription('Escribe tu pregunta')
						.setRequired(true)
				),
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const pregunta = formatPregunta(interaction.options.getString('pregunta')!)
		const IsThinkingEmbed = new EmbedBuilder()
			.setAuthor({
				name: `${interaction.user.username} le ha preguntado a la bola 8`,
				iconURL: interaction.user.displayAvatarURL({ size: 64 })
			})
			.setTitle(pregunta)
			.setDescription("La bola está pensando...")
			.setColor(Colors.White)
			.setFooter({ text: "🎱" })

		await interaction.reply({ embeds: [IsThinkingEmbed] })

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setTimeout(async () => {


			const AnswerEmbed = EmbedBuilder.from(IsThinkingEmbed)
				.setColor("Blurple")
				.setDescription(`${PossibleAnswers[Math.floor(Math.random() * PossibleAnswers.length)]}`)

			await interaction.editReply({
				embeds: [AnswerEmbed]
			})
		}, 3_000);
	}
}


function formatPregunta(pregunta: string) {
	let aux = pregunta
	if (pregunta[0] !== '¿')
		aux = '¿' + pregunta

	if (pregunta[pregunta.length - 1] !== '?')
		aux = aux + '?'

	return aux
}