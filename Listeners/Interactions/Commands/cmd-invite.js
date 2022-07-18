const { CommandInteraction, EmbedBuilder, Colors } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Mi enlace de invitación para que me añadas a tu servidor!'),
  isGlobal: true,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const invite = interaction.client.generateInvite({
      scopes: ["bot", "applications.commands"],
      permissions: ["AddReactions", "EmbedLinks", "ModerateMembers", "KickMembers", "BanMembers",
        "AttachFiles", "ManageChannels", "ManageRoles", "MuteMembers", "ViewChannel", "SendMessages", "SendMessagesInThreads",
        "ManageMessages", "UseExternalStickers", "UseExternalEmojis", "ReadMessageHistory", "ManageGuild", "ManageEmojisAndStickers"]
    });

    const inviteEmbed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL({ size: 128, dynamic: true }) })
      .setDescription(`[-> **¡Aqui tienes mi enlace de invitación!** <-](${invite})`)
      .setColor(Colors.Blue)

    return await interaction.reply({ embeds: [inviteEmbed] })
  }
}