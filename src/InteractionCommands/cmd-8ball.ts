import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Fuyumi } from "../types";

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
	async execute(i) {

		if (i.isChatInputCommand()) {
			const IsThinkingEmbed = new EmbedBuilder()
				.setAuthor({
					name: `${i.user.username} le ha preguntado a la bola 8`,
					iconURL: i.user.displayAvatarURL({ size: 64 })
				})
				.setTitle(`La bola 8 está pensando...`)
				.setDescription(`**Pregunta**:\n¿${i.options.getString("pregunta", true)}?`)
				.setColor(Colors.White)

			await i.reply({ embeds: [IsThinkingEmbed] })

			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			setTimeout(async () => {


				const AnswerEmbed = EmbedBuilder.from(IsThinkingEmbed)
					.setColor("Blurple")
					.setTitle(PossibleAnswers[Math.floor(Math.random() * PossibleAnswers.length)])

				await i.editReply({
					embeds: [AnswerEmbed]
				})
			}, 5_000);
		}
	},
} as Fuyumi.SlashCommand