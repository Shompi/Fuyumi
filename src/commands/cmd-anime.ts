import { SearchAnimeFLV } from "../functions/anime-flv.ts";
import { SearchMyAnimeList } from "../functions/anime-mal.ts";
import { Subcommand } from "@sapphire/plugin-subcommands";

export class AnimeCommands extends Subcommand {
	public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'anime',
			subcommands: [
				{
					name: 'my-anime-list',
					chatInputRun: 'chatInputMal'
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

	public async chatInputFLV(interaction: Subcommand.ChatInputCommandInteraction) {
		await SearchAnimeFLV(interaction)
	}
}