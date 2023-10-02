import { EmbedBuilder, ApplicationCommandType, Colors } from 'discord.js';
import { Command } from '@sapphire/framework';

export class UserCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder //
				.setName('Avatar')
				.setType(ApplicationCommandType.User),
		);
	}

	public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		const target = interaction.targetId;

		const targetUser = await interaction.client.users.fetch(target);

		const embed = new EmbedBuilder()
			.setTitle(`Avatar de ${targetUser.username}`)
			.setImage(targetUser.displayAvatarURL({ size: 2048 }))
			.setColor(interaction.inCachedGuild() ? interaction.member.displayColor : Colors.Blue);

		return await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}