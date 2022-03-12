const { CommandInteraction, WebhookClient } = require('discord.js');
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

const webhook = new WebhookClient({ id: process.env.UWU_HOOK_ID, token: process.env.UWU_HOOK_TOKEN });

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

    await webhook.send({
      username: interaction.user.username,
      avatarURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }),
      content: finalText,
    })

    return await interaction.reply({ content: 'Tu mensaje ha sido enviado!', ephemeral: true });
  }
}