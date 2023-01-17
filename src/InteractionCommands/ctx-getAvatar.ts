import { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, Colors, type UserContextMenuCommandInteraction } from 'discord.js';


export = {
  data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(ApplicationCommandType.User),
  isGlobal: true,

  async execute(interaction: UserContextMenuCommandInteraction) {

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