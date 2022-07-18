//@ts-check
const { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, ContextMenuCommandInteraction, Colors, } = require('discord.js');


module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(ApplicationCommandType.User),
  isGlobal: true,
  /**
   * 
   * @param {ContextMenuCommandInteraction} interaction 
   */
  async execute(interaction) {

    const target = interaction.targetId;

    const targetUser = await interaction.client.users.fetch(target);

    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${targetUser.tag}`)
      .setImage(targetUser.displayAvatarURL({ size: 2048 }))
      .setColor(interaction.inCachedGuild() ? interaction.member.displayColor : Colors.Blue);

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
}