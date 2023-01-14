import { ActionRowBuilder, type ChatInputCommandInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, EmbedBuilder, StringSelectMenuInteraction, InteractionType, ButtonBuilder, ButtonStyle } from "discord.js";
import { searchAnime, getAnimeInfo, PartialAnimeData, AnimeData } from "../Helpers/animeflv"

export async function SearchAnimeFLV(i: ChatInputCommandInteraction) {

	const InitialReply = await i.deferReply()
	const AnimeName = i.options.getString('nombre')

	const AnimeSearchResults = await searchAnime(AnimeName)

	if (!AnimeSearchResults || AnimeSearchResults.length === 0) {
		return await i.editReply({ content: 'No encontré ningún anime con ese nombre, intenta la búsqueda de nuevo con un nombre distinto.' })
	}

	if (AnimeSearchResults.length === 1) {
		const AnimeDetails = await getAnimeInfo(AnimeSearchResults[0].title)
		return await SendAnimeDetails(i, AnimeDetails)
	}

	await i.editReply({
		content: 'Selecciona uno de los animes que encontré!',
		components: [CreateSelectMenu(AnimeSearchResults)]
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
	return await SendAnimeDetails(SelectMenuInteraction, AnimeDetails)
}

function CreateSelectMenu(animes: PartialAnimeData[]): ActionRowBuilder<StringSelectMenuBuilder> {

	if (animes.length > 25)
		animes = animes.slice(0, 25)

	return new ActionRowBuilder<StringSelectMenuBuilder>()
		.setComponents(
			new StringSelectMenuBuilder()
				.setCustomId('anime-select-menu')
				.setPlaceholder('Selecciona una animé de la lista...')
				.setOptions(
					animes.map(anime =>
						new StringSelectMenuOptionBuilder()
							.setLabel(anime.title)
							.setValue(anime.title)
							.setDescription(anime.type.toUpperCase() || null)
					)
				)
		)
}

async function SendAnimeDetails(i: ChatInputCommandInteraction | StringSelectMenuInteraction, details: AnimeData) {

	const { cover, episodes, genres, status, synopsis, title, url, alternative_title } = details;

	const DetailsEmbed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(`${synopsis}\n\n**Géneros:** ${genres.join(", ")}`)
		.setAuthor({
			name: `Busqueda de ${i.user.username}`,
			iconURL: i.user.avatarURL({ size: 128 }),
			url: url
		})
		.setColor("Random")
		.setFooter({ text: alternative_title || null })
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

	const UrlButtonRow = new ActionRowBuilder<ButtonBuilder>()
		.setComponents(
			new ButtonBuilder()
				.setLabel("Ir a la página")
				.setEmoji("🔗")
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