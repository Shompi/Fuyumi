const { CommandInteraction, MessageEmbed, Util } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Uwuifier = require('uwuifier');
const uwuifier = new Uwuifier({
  spaces: {
    faces: 0.0,
    actions: 0.0,
    stutters: 0.1
  },
  words: 0.7,
  exclamations: 1
});


module.exports = {
  data: new SlashCommandBuilder()
    .setName('uwu')
    .setDescription('Escribe una frase para convertirla en UWU')
    .addStringOption(text => text.setRequired(true).setName('texto').setDescription("El texto que quieres enviar 'uwuificado'")),
  isGlobal: false,
  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {
    // Your code...

    const text = interaction.options.getString('texto');

    if (text.length < 10)
      return await interaction.reply({ ephemeral: true, content: 'El texto que has ingresado es muy corto, por favor ingresa textos de al menos 10 caracteres.' });

    const finalText = uwuifier.uwuifyWords(text);
    const uwuEmbed = new MessageEmbed()
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 64, dynamic: true }) })
      .setDescription(finalText)
      .setColor(Util.resolveColor("DEFAULT"))

    return await interaction.reply({
      embeds: [uwuEmbed]
    });
  }
}