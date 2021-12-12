const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ContextMenuInteraction, MessageEmbed } = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(2)
    .setDefaultPermission(true),
  isGlobal: true,
  /**
   * 
   * @param {ContextMenuInteraction} interaction 
   */
  async execute(interaction) {
    const target = interaction.targetId;

    const targetUser = await interaction.client.users.fetch(target, { cache: true });

    const embed = new MessageEmbed()
      .setTitle(`Avatar de ${targetUser.tag}`)
      .setImage(targetUser.displayAvatarURL({ size: 2048, dynamic: true }))
      .setColor(interaction.member.displayColor);

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
}