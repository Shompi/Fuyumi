import { EmbedBuilder, Colors, OAuth2Scopes } from 'discord.js';
import { Command } from '@sapphire/framework';

export class InviteCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('invite')
				.setDescription('Mi enlace de invitación para que me añadas a tu servidor!')
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const invite = interaction.client.generateInvite({
			scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
			permissions: ["AddReactions", "EmbedLinks", "ModerateMembers", "KickMembers", "BanMembers",
				"AttachFiles", "ManageChannels", "ManageRoles", "MuteMembers", "ViewChannel", "SendMessages", "SendMessagesInThreads",
				"ManageMessages", "UseExternalStickers", "UseExternalEmojis", "ReadMessageHistory", "ManageGuild", "ManageEmojisAndStickers"]
		});

		const inviteEmbed = new EmbedBuilder()
			.setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ size: 128 }) })
			.setDescription(`[-> **¡Aqui tienes mi enlace de invitación!** <-](${invite})`)
			.setColor(Colors.Blue)

		return await interaction.reply({ embeds: [inviteEmbed] })

	}
}