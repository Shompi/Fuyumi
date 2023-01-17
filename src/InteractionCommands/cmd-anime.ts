import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SearchAnimeFLV } from "./SubCommands/anime-flv";
import { SearchMyAnimeList } from "./SubCommands/anime-mal";
import { MatchScreenshotToAnime } from "./SubCommands/anime-match";

export = {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('Comandos de anime, powered by Tio Anime')
		.addSubcommand(mal =>
			mal.setName('my-anime-list')
				.setDescription('Busca un animé en My Anime List (Resultados en inglés)')
				.addStringOption(nombre =>
					nombre.setName('nombre')
						.setRequired(true)
						.setDescription('Nombre del anime que quieres buscar')
				)
		)
		.addSubcommand(trace =>
			trace.setName('match')
				.setDescription('Sube una captura de pantalla de un animé y sabrás el animé y el episodio de la captura')
				.addAttachmentOption(image =>
					image.setName('captura')
						.setDescription('Sube la imagen del animé')
				)
				.addStringOption(url =>
					url.setName('url')
						.setDescription('La url de la imágen')
				)
		)
		.addSubcommand(flv =>
			flv.setName('anime-flv')
				.setDescription('Busca un animé en AnimeFLV')
				.addStringOption(nombre =>
					nombre.setName('nombre')
						.setDescription('El nombre del animé')
						.setRequired(true)
				)
		)
	,
	isGlobal: true,
	async execute(i: ChatInputCommandInteraction) {

		try {

			switch (i.options.getSubcommand()) {
				case 'my-anime-list':
					await SearchMyAnimeList(i)
					break
				case 'match':
					await MatchScreenshotToAnime(i)
					break
				case 'anime-flv':
					await SearchAnimeFLV(i)
					break
			}

		} catch (e) {
			console.log(e);

			if (i.deferred || i.replied)
				await i.editReply({ content: 'La interacción ha finalizado.', embeds: [], components: [] })
			else
				await i.reply({ content: 'La interacción ha finalizado.', embeds: [], components: [] })
		}

		return
	}
}