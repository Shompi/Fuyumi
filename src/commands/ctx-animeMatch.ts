import { ApplicationCommandType, Attachment } from 'discord.js';
import { SearchAnime } from '../functions/Helpers/traceMoeAPI.js';
import { Command } from '@sapphire/framework';

export class UserCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('Anime Match')
				.setType(ApplicationCommandType.Message),
		);
	}
	public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		if (interaction.isMessageContextMenuCommand()) {

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
}