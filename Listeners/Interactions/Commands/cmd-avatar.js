const { CommandInteraction, MessageEmbed, Util } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Ve el avatar tuyo o de otro usuario')
    .addUserOption(user => user.setName('user').setDescription('El usuario del cual quieres obtener el avatar').setRequired(false)),
  isGlobal: false,
  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {
    // Your code...

    // Esta interacción puede ser usada en cualquier contexto (DM, Guild)
    const user = interaction.options.getUser('user', false) ?? interaction.user;

    await user.fetch();

    return await interaction.reply({
      ephemeral: true,
      embeds: [new MessageEmbed()
        .setColor(Util.resolveColor("BLUE"))
        .setTitle(`Avatar de ${user.tag}`)
        .setImage(user.displayAvatarURL({ size: 512, dynamic: true }))
      ]
    });
  }
}