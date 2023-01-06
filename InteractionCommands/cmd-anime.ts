import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BuscarAnime } from "./SubCommands/anime-buscar";
import { MatchScreenshotToAnime } from "./SubCommands/anime-match";

export = {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('Comandos de anime, powered by Tio Anime')
		.addSubcommand(buscar =>
			buscar.setName('buscar')
				.setDescription('Busca un animé')
				.addStringOption(nombre =>
					nombre.setName('nombre')
						.setRequired(true)
						.setDescription('Nombre del anime que quieres buscar, puede estar incompleto')
				)
		)
		.addSubcommand(match =>
			match.setName('match')
				.setDescription('Sube una captura de pantalla de un animé y sabrás el animé y el episodio de la captura')
				.addAttachmentOption(image =>
					image.setName('captura')
						.setDescription('Sube la imagen del animé')
				)
				.addStringOption(url =>
					url.setName('url')
						.setDescription('La url de la imágen')
				)
		),
	isGlobal: true,
	async execute(i: ChatInputCommandInteraction) {

		switch (i.options.getSubcommand()) {
			case 'buscar':
				return await BuscarAnime(i)
			case 'match':
				return await MatchScreenshotToAnime(i)
		}

		return;
	}
}