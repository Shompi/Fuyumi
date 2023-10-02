import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Colors, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import type { MyAnimeList } from "../Types/index.d.ts";

const WebPageURL = "https://myanimelist.net/"
const GetAnimeListEndpoint = "https://api.myanimelist.net/v2/"
const GetAnimeDetailsEndpoint = "https://api.myanimelist.net/v2/anime/"

export async function SearchMyAnimeList(i: ChatInputCommandInteraction) {

	try {
		const InitialReply = await i.deferReply()
		const AnimeName = i.options.getString('nombre', true)

		const Animes = await GetAnimeList({ q: AnimeName })

		if (!Animes) {
			return await i.editReply({
				content: 'Ocurrió un error con este comando, por favor intentalo más tarde.'
			})
		}

		if (Animes.data.length === 0) {
			return await i.editReply({
				content: 'No encontré ningún animé con ese nombre.'
			})
		}

		if (Animes.data.length === 1) {
			return await SendAnimeDetails(i, Animes.data[0].node.id)
		}

		let ActionRow: ActionRowBuilder<ButtonBuilder> | ActionRowBuilder<StringSelectMenuBuilder>

		if (Animes.data.length > 5) {
			ActionRow = CreateSelectMenuRow(Animes)
		} else {
			ActionRow = CreateButtonsRow(Animes)
		}

		await i.editReply({
			content: 'Selecciona uno de los animés que encontré:',
			components: [ActionRow]
		})


		const PressedButton = await InitialReply.awaitMessageComponent({
			filter: (async PressedButton => {

				if (PressedButton.user.id !== i.user.id) {
					await PressedButton.reply({
						content: 'Esta interacción no es tuya!',
						ephemeral: true
					})
					return false
				}

				return true
			}),
			dispose: true,
			time: 60000,
		}) as ButtonInteraction | StringSelectMenuInteraction

		await PressedButton.update({
			content: 'Obteniendo información del animé...',
			components: []
		})

		const SelectedAnimeId = PressedButton.componentType === ComponentType.Button ? PressedButton.customId : PressedButton.values[0]

		return await SendAnimeDetails(i, parseInt(SelectedAnimeId))

	}
	catch (e) {
		console.log(e)
		return await i.editReply({
			content: 'Esta interaccíón ha finalizado.',
			components: []
		})

	}

}


// Utility Functions
function CreateSelectMenuRow(Animes: MyAnimeList.GetAnimeListResponse): ActionRowBuilder<StringSelectMenuBuilder> {

	if (Animes.data.length > 25)
		Animes.data = Animes.data.slice(0, 25)

	return new ActionRowBuilder<StringSelectMenuBuilder>()
		.setComponents(
			new StringSelectMenuBuilder()
				.setCustomId('anime-select-menu')
				.setPlaceholder('Selecciona una animé de la lista...')
				.setOptions(
					Animes.data.map(anime =>
						new StringSelectMenuOptionBuilder()
							.setLabel(anime.node.title)
							.setValue(anime.node.id.toString())
					)
				)
		)
}

function CreateButtonsRow(Animes: MyAnimeList.GetAnimeListResponse) {

	return new ActionRowBuilder<ButtonBuilder>()
		.setComponents(
			Animes.data.map(Anime => {
				return new ButtonBuilder()
					.setCustomId(Anime.node.id.toString())
					.setLabel(Anime.node.title)
					.setStyle(ButtonStyle.Primary)
			})
		)
}

function GetAnimeRating(rating: MyAnimeList.Rating): string {
	if (!rating) return "Desconocido"

	const Ratings = {
		g: "Para toda audiencia",
		pg: "Necesita supervisión\nde un adulto",
		pg_13: "PG-13",
		r: "R-17",
		"r+": "Profanidades y Nudismo",
		rx: "Hentai"
	}

	return Ratings[rating]
}

function GetAnimeAiringStatus(status: MyAnimeList.AiringStatus) {
	switch (status) {
		case 'currently_airing':
			return "En Emisión"
		case 'finished_airing':
			return "Finalizado"
		case 'not_yet_aired':
			return "Aún no emitido"
	}
}

async function GetAnimeList(options: MyAnimeList.GetAnimeListOptions): Promise<MyAnimeList.GetAnimeListResponse> {

	const URL = GetAnimeListEndpoint + `anime?q=${options.q}&limit=${25}`

	return await fetch(URL, {
		headers: {
			"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID ?? "MAL TOKEN not set."
		}
	}).then(response => response.json()) as MyAnimeList.GetAnimeListResponse
}

async function SendAnimeDetails(i: ChatInputCommandInteraction, AnimeId: number) {
	const QueryFields = [
		"id",
		"title",
		"main_picture",
		"alternative_titles",
		"start_date",
		"end_date",
		"synopsis",
		"mean",
		//"rank",
		//"popularity",
		//"num_list_users",
		//"num_scoring_users",
		"nsfw",
		//"created_at",
		//"updated_at",
		"media_type",
		"status",
		"genres",
		//"my_list_status",
		"num_episodes",
		"start_season",
		"broadcast",
		//"source",
		//"average_episode_duration",
		"rating",
		"pictures",
		//"background",
		//"related_anime",
		//"related_manga",
		//"recommendations",
		"studios",
		//"statistics"
	]

	const URL = GetAnimeDetailsEndpoint + `${AnimeId}?fields=${QueryFields.join(",")}`

	const {
		id,
		title,
		alternative_titles,
		pictures,
		mean,
		genres,
		status,
		rating,
		synopsis,
	} = await fetch(URL, {
		headers: {
			"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID ?? "MAL Client id not set."
		}
	}).then(response => response.json()) as MyAnimeList.GetAnimeDetailsResponse

	const DetailsEmbed = new EmbedBuilder()
		.setTitle(`${title} - ⭐${mean?.toFixed(2) ?? "0.0"}`)
		.setColor(Colors.Blurple)
		.setDescription(`${synopsis}\n\n**Genres:** ${genres.map(genre => genre.name).join(", ")}`)
		.setFooter({
			text: alternative_titles.ja
		})
		.setThumbnail(pictures[0]?.large)
		.setAuthor({
			name: "Powered by MyAnimeList",
			url: WebPageURL + `anime/${id}`
		})
		.addFields(
			{
				name: "Status",
				value: GetAnimeAiringStatus(status) ?? "-",
				inline: true
			},
			{
				name: "Rating",
				value: GetAnimeRating(rating) ?? "-",
				inline: true
			}
		)

	return await i.editReply({
		content: null,
		embeds: [DetailsEmbed],
		components: []
	})
}