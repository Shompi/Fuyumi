import { ContextMenuCommandBuilder, ApplicationCommandType, type MessageContextMenuCommandInteraction, type Attachment } from 'discord.js';
import { SearchAnime } from './Helpers/traceMoeAPI';

export = {
	data: new ContextMenuCommandBuilder()
		.setName('Anime Match')
		.setType(ApplicationCommandType.Message),
	isGlobal: true,

	async execute(interaction: MessageContextMenuCommandInteraction) {

		const Attachments = interaction.targetMessage.attachments
		let ChoosenAttachment: Attachment;

		/** Check if the message has attachments first */
		if (Attachments.size === 0)
			return await interaction.reply({
				content: 'Este mensaje no tiene ningún archivo de imagen.',
				ephemeral: true
			})

		if (Attachments.size > 1)
			ChoosenAttachment = Attachments.random()!
		else
			ChoosenAttachment = Attachments.first()!
		try {
			await interaction.deferReply()
			return await SearchAnime(ChoosenAttachment.url, interaction)

		} catch (e) {

			console.log(e)
			await interaction.editReply({
				content: 'Esta interacción ha finalizado.'
			})

		}
	}
}
