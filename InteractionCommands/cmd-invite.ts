import { ChatInputCommandInteraction, EmbedBuilder, Colors, SlashCommandBuilder, OAuth2Scopes } from 'discord.js';

export = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Mi enlace de invitación para que me añadas a tu servidor!'),
  isGlobal: true,

  async execute(interaction: ChatInputCommandInteraction) {
    const invite = interaction.client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: ["AddReactions", "EmbedLinks", "ModerateMembers", "KickMembers", "BanMembers",
        "AttachFiles", "ManageChannels", "ManageRoles", "MuteMembers", "ViewChannel", "SendMessages", "SendMessagesInThreads",
        "ManageMessages", "UseExternalStickers", "UseExternalEmojis", "ReadMessageHistory", "ManageGuild", "ManageEmojisAndStickers"]
    });

    const inviteEmbed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL({ size: 128 }) })
      .setDescription(`[-> **¡Aqui tienes mi enlace de invitación!** <-](${invite})`)
      .setColor(Colors.Blue)

    return await interaction.reply({ embeds: [inviteEmbed] })
  }
}