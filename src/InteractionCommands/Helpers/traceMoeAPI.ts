import { type ChatInputCommandInteraction, Colors, EmbedBuilder, type MessageContextMenuCommandInteraction } from "discord.js";
import { TraceMoe } from "trace.moe.ts";
const TraceApi = new TraceMoe()

export async function SearchAnime(ImageUrl: string, i: ChatInputCommandInteraction | MessageContextMenuCommandInteraction) {

	const Quota = await TraceApi.fetchMe()

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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		.setTitle(FirstResult.anilist?.title?.romaji ?? null)
		.setImage(FirstResult.image)
		.setColor(Colors.Blurple)
		.setDescription(`**Semejanza:** ${(FirstResult.similarity * 100).toFixed(2)}%\n**Episodio:** ${FirstResult.episode ?? "-"}\n[Video](${FirstResult.video})\n\n**Desde ${(FirstResult.from / 60).toFixed(0)}m ${(FirstResult.from % 60).toFixed(0)}s al ${(FirstResult.to / 60).toFixed(0)}m ${(FirstResult.to % 60).toFixed(0)}s**`)

	return await i.editReply({
		content: 'Aquí estan los resultados!',
		embeds: [ResultEmbed]
	})
}