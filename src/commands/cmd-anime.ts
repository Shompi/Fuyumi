import { SearchAnimeFLV } from "../functions/anime-flv.js";
import { SearchMyAnimeList } from "../functions/anime-mal.js";
import { MatchScreenshotToAnime } from "../functions/anime-match.js";
import { Subcommand } from "@sapphire/plugin-subcommands";

export class AnimeCommands extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'anime',
			subcommands: [
				{
					name: 'my-anime-list',
					chatInputRun: 'chatInputMal'
				},
				{
					name: 'match',
					chatInputRun: 'chatInputMatch'
				},
				{
					name: 'anime-flv',
					chatInputRun: 'chatInputFLV'
				}
			]
		});
	}

	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('anime')
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
		);
	}


	public async chatInputMal(interaction: Subcommand.ChatInputCommandInteraction) {
		await SearchMyAnimeList(interaction)
	}

	public async chatInputMatch(interaction: Subcommand.ChatInputCommandInteraction) {
		await MatchScreenshotToAnime(interaction)
	}

	public async chatInputFLV(interaction: Subcommand.ChatInputCommandInteraction) {
		await SearchAnimeFLV(interaction)
	}
}