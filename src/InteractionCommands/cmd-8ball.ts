import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Fuyumi } from "@myTypes/index";

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


export = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Preguntale lo que quieras a la bola 8')
		.setDescriptionLocalization("en-US", "Ask whatever you want to the 8 ball")
		.addStringOption(question =>
			question.setName('pregunta')
				.setDescription('Escribe tu pregunta')
				.setRequired(true)
		),
	isGlobal: true,
	async execute(interaction) {


		if (interaction.isChatInputCommand()) {

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
	},
} as Fuyumi.SlashCommandTemplate

function formatPregunta(pregunta: string) {
	let aux = pregunta
	if (pregunta[0] !== '¿')
		aux = '¿' + pregunta

	if (pregunta[pregunta.length - 1] !== '?')
		aux = aux + '?'

	return aux
}