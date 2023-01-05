import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { TraceMoe } from "trace.moe.ts";
const TraceApi = new TraceMoe()

export async function MatchScreenshotToAnime(i: ChatInputCommandInteraction) {




	const ImageUrl = i.options.getString('url') ?? i.options.getAttachment('captura')?.url

	if (!ImageUrl) {
		return await i.reply({
			content: 'Debes ingresar una url o una imagen.',
			ephemeral: true
		})
	}

	try {

		await i.deferReply()

		const Quota = await TraceApi.fetchMe()

		console.log(Quota);


		if (Quota.quotaUsed === Quota.quota) {
			return await i.editReply({
				content: 'Lo siento, no puedes usar este comando en este momento.'
			})
		}

		const Results = await TraceApi.fetchAnime(ImageUrl, { anilistInfo: true })

		const FirstResult = Results.result[0]

		if (FirstResult.similarity < 0.91) {
			return await i.editReply({
				content: 'No encontré un animé con una semejanza de al menos 90%.'
			})
		}

		if (!FirstResult) return await i.editReply({ content: 'No encontré ningún animé parecido a la imagen que enviaste.' })

		const ResultEmbed = new EmbedBuilder()
			.setTitle(FirstResult.anilist?.title.romaji)
			.setImage(FirstResult.image)
			.setColor(Colors.Blurple)
			.setDescription(`**Semejanza:** ${(FirstResult.similarity * 100).toFixed(2)}%\n**Episodio:** ${FirstResult.episode ?? "-"}\n[Video](${FirstResult.video})\n\n**Desde ${(FirstResult.from / 60).toFixed(0)}m ${(FirstResult.from % 60).toFixed(0)}s al ${(FirstResult.to / 60).toFixed(0)}m ${(FirstResult.to % 60).toFixed(0)}s**`)

		return await i.editReply({
			content: 'Aquí estan los resultados!',
			embeds: [ResultEmbed]
		})
	}
	catch (e) {
		console.log(e)

		return await i.editReply({ content: 'La interacción ha finalizado.' })

	}

}