const { CommandInteraction } = require('discord.js');
const { Model } = require('mongoose');
/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports.BirthdaySet = async (interaction) => {
  const month = interaction.options.getInteger('mes', true);
  const day = interaction.options.getInteger('dia', true);

  await interaction.deferReply({ ephemeral: true });

  try {

    /** @type {Model} */
    const BirthdayModel = interaction.client.models.BirthdayModel;

    if (await BirthdayModel.exists({ userId: interaction.user.id })) {
      return await interaction.editReply({ content: 'Tu cumpleaños ya está ingresado, si deseas editarlo, usa el comando **/birthday editar**' });
    } else {

      await BirthdayModel.create({
        month,
        day,
        userId: interaction.user.id
      });

      return await interaction.editReply({
        content: `Tu cumpleaños ha sido guardado con fecha **${day < 10 ? `0${day}` : day}/${month + 1 < 10 ? `0${month + 1}` : month + 1}**`
      });
    }
  } catch (e) {
    console.log("Ocurrió un error al intentar guardar un cumpleaños...");
    console.error(e);
    await interaction.editReply({ content: "Ocurrió un error al intentar guardar tu cumpleaños...\n¡Por favor intentalo más tarde!" })
  }
}