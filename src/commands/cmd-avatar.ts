import { EmbedBuilder, Colors } from 'discord.js';
import { Command } from '@sapphire/framework';

export class UserAvatar extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('avatar')
				.setDescription('Ve el avatar tuyo o de otro usuario')
				.addUserOption(user => user.setName('user')
					.setDescription('El usuario del cual quieres obtener el avatar')
					.setRequired(false))
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user', false) ?? interaction.user

		await user.fetch()

		return await interaction.reply({
			ephemeral: true,
			embeds: [new EmbedBuilder()
				.setColor(Colors.Blue)
				.setTitle(`Avatar de ${user.username}`)
				.setImage(user.displayAvatarURL({ size: 512 }))
			]
		})
	}
}