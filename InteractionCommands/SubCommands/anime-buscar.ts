import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, ComponentType, EmbedBuilder } from "discord.js";
import { request } from "undici"
import { MyAnimeList } from "../../index";

const WebPageURL = "https://myanimelist.net/"
const GetAnimeListEndpoint = "https://api.myanimelist.net/v2/"
const GetAnimeDetailsEndpoint = "https://api.myanimelist.net/v2/anime/"

export async function BuscarAnime(i: ChatInputCommandInteraction) {

	try {
		const InitialReply = await i.deferReply()
		const AnimeName = i.options.getString('nombre')

		let Animes = await GetAnimeList({ q: AnimeName })

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

		if (Animes.data.length > 5) {
			Animes.data = Animes.data.slice(0, 5)
		}



		const ButtonsRow = CreateButtonsRow(Animes)

		await i.editReply({
			content: 'Selecciona uno de los animés que encontré:',
			components: [ButtonsRow]
		})


		const PressedButton = await InitialReply.awaitMessageComponent({
			componentType: ComponentType.Button,
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
		})

		await PressedButton.update({
			content: 'Obteniendo información del animé...',
			components: []
		})

		const SelectedAnimeId = PressedButton.customId

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

async function GetAnimeList(options: MyAnimeList.GetAnimeListOptions): Promise<MyAnimeList.GetAnimeListResponse> {

	const URL = GetAnimeListEndpoint + `anime?q=${options.q}&limit=${4}`

	return await request(URL, {
		headers: {
			"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
		}
	}).then(response => response.body.json()) as MyAnimeList.GetAnimeListResponse
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
		//"nsfw",
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
		media_type,
		genres,
		status,
		broadcast,
		rating,
		synopsis
	} = await request(URL, {
		headers: {
			"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
		}
	}).then(response => response.body.json()) as MyAnimeList.GetAnimeDetailsResponse


	const DetailsEmbed = new EmbedBuilder()
		.setTitle(`${title} - ⭐${mean?.toFixed(2)}`)
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
				value: status ?? "-",
				inline: true
			},
			{
				name: "Rating",
				value: rating ?? "-",
				inline: true
			}
		)

	return await i.editReply({
		content: null,
		embeds: [DetailsEmbed],
		components: []
	})

}