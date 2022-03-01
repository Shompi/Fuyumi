const { CommandInteraction } = require('discord.js');
const { Document, Model } = require('mongoose');

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports.BirthdayEdit = async (interaction) => {

  await interaction.deferReply({ ephemeral: true });

  const month = interaction.options.getInteger('mes');
  const day = interaction.options.getInteger('dia');

  try {
    /** @type {Model} */
    const BirthdayModel = interaction.client.models.BirthdayModel;

    /** @type {Document} */
    const document = await BirthdayModel.findOne({ userId: interaction.user.id });

    if (document) {

      if (document.retries <= 0)
        return await interaction.editReply({ content: 'No puedes editar nuevamente tu cumpleaños.' });

      document.month = month;
      document.day = day;
      document.retries -= 1;

      await document.save();
      return await interaction.editReply({ content: `Tu cumpleaños fue editado a la fecha **${document.day < 10 ? `0${document.day}` : document.day}/${document.month + 1 < 10 ? `0${document.month + 1}` : document.month + 1}**` })
    }

  } catch (e) {
    console.log('Ocurrió un error al intentar editar un cumpleaños');
    console.error(e);
    return await interaction.editReply({ content: 'Ocurrió un error al intentar editar tu cumpleaños.\n¡Por favor inténtalo más tarde!' });
  }
}