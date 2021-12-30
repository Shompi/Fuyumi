const { CommandInteraction, MessageEmbed, InteractionCollector } = require('discord.js');
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
      permissions: ["ADD_REACTIONS", "EMBED_LINKS", "MODERATE_MEMBERS", "KICK_MEMBERS", "BAN_MEMBERS",
        "ATTACH_FILES", "MANAGE_CHANNELS", "MANAGE_ROLES", "MUTE_MEMBERS", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS",
        "MANAGE_MESSAGES", "MANAGE_EMOJIS_AND_STICKERS", "USE_EXTERNAL_STICKERS", "READ_MESSAGE_HISTORY", "MANAGE_GUILD"]
    });

    const inviteEmbed = new MessageEmbed()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL({ size: 128, dynamic: true }) })
      .setDescription(`[-> **¡Aqui tienes mi enlace de invitación!** <-](${invite})`)
      .setColor('BLUE')

    return await interaction.reply({ embeds: [inviteEmbed] })
  }
}