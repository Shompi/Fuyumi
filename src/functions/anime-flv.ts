import { ActionRowBuilder, type ChatInputCommandInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, EmbedBuilder, StringSelectMenuInteraction, InteractionType, ButtonBuilder, ButtonStyle, Collection } from "discord.js";
import { AnimeData, getAnimeInfo, searchAnime } from "animeflv-api"
import { PartialAnimeData } from "animeflv-api/dist/types/index.js";
export async function SearchAnimeFLV(i: ChatInputCommandInteraction) {

	const InitialReply = await i.deferReply()
	const AnimeName = i.options.getString('nombre', true)

	const AnimeSearchResults = await searchAnime(AnimeName)

	if (!AnimeSearchResults || AnimeSearchResults.data.length === 0) {
		return await i.editReply({ content: 'No encontré ningún anime con ese nombre, intenta la búsqueda de nuevo con un nombre distinto.' })
	}

	if (AnimeSearchResults.data.length === 1) {
		const AnimeDetails = await getAnimeInfo(AnimeSearchResults.data[0].id)
		if (!AnimeDetails) return await i.editReply('No encontré ningun animé con esa id.')

		return await SendAnimeDetails(i, AnimeDetails)
	}

	await i.editReply({
		content: 'Selecciona uno de los animes que encontré!',
		components: [CreateSelectMenu(AnimeSearchResults.data)]
	})

	const SelectMenuInteraction = await InitialReply.awaitMessageComponent({
		componentType: ComponentType.StringSelect,
		filter: async (interaction) => {
			if (interaction.user.id !== i.user.id) {
				await interaction.reply({ ephemeral: true, content: 'Esta interacción no es tuya!' })
				return false
			}
			return true
		},
		time: 60_000
	})

	const SelectedAnime = SelectMenuInteraction.values[0]

	const AnimeDetails = await getAnimeInfo(SelectedAnime)

	if (!AnimeDetails) return await i.editReply({ content: 'Ocurrió un error al intentar obtener la información del animé.', components: [], embeds: [] })

	return await SendAnimeDetails(SelectMenuInteraction, AnimeDetails)
}

function CreateSelectMenu(animes: PartialAnimeData[]): ActionRowBuilder<StringSelectMenuBuilder> {

	if (animes.length > 25)
		animes = animes.slice(0, 25)

	const AnimesCollection = new Collection<string, PartialAnimeData>()

	for (const Anime of animes) {
		AnimesCollection.set(Anime.id, Anime)
	}

	return new ActionRowBuilder<StringSelectMenuBuilder>()
		.setComponents(
			new StringSelectMenuBuilder()
				.setCustomId('anime-select-menu')
				.setPlaceholder('Selecciona una animé de la lista...')
				.setOptions(
					AnimesCollection.map(anime =>
						new StringSelectMenuOptionBuilder()
							.setLabel(anime.title)
							.setValue(anime.id)
							.setDescription(anime.type.toUpperCase() || "ANIME")
					)
				)
		)
}

async function SendAnimeDetails(i: ChatInputCommandInteraction | StringSelectMenuInteraction, details: AnimeData) {

	const { cover, episodes, genres, status, synopsis, title, url, alternative_titles, rating } = details;

	const DetailsEmbed = new EmbedBuilder()
		.setTitle(`${title} - ⭐${rating}`)
		.setDescription(`${synopsis}\n\n**Géneros:** ${genres.join(", ")}`)
		.setAuthor({
			name: `Búsqueda de ${i.user.username}`,
			iconURL: i.user.displayAvatarURL({ size: 128 }),
			url: url
		})
		.setColor("Random")
		.setThumbnail(cover)
		.addFields([
			{
				name: 'Episodios',
				value: episodes.toString(),
				inline: true
			},
			{
				name: 'Status',
				value: status,
				inline: true
			}
		])

	if (alternative_titles.length > 0) {
		DetailsEmbed.setFooter({ text: alternative_titles.join(", ") })
	}

	const UrlButtonRow = new ActionRowBuilder<ButtonBuilder>()
		.setComponents(
			new ButtonBuilder()
				.setLabel("Ir a la página")
				.setStyle(ButtonStyle.Link)
				.setURL(url)
		)

	if (i.type === InteractionType.MessageComponent)
		return await i.update({
			content: null,
			embeds: [DetailsEmbed],
			components: [UrlButtonRow]
		})

	return await i.editReply({
		content: null,
		embeds: [DetailsEmbed],
		components: [UrlButtonRow]
	})
}