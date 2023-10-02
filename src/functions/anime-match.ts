import { ChatInputCommandInteraction } from "discord.js";
import { SearchAnime } from "../functions/Helpers/traceMoeAPI.js";

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
		await SearchAnime(ImageUrl, i)

	}
	catch (e) {
		console.log(e)

		return await i.editReply({ content: 'La interacción ha finalizado.' })

	}

}