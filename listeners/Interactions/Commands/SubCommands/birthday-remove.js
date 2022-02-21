const { CommandInteraction } = require('discord.js');
const { establishConnection } = require('../../../../Schemas/Birthdays');

/**
 * @param {CommandInteraction} interaction
 */

module.exports.BirthdayRemove = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  try {

    const BirthdayModel = await establishConnection();

    await BirthdayModel.deleteOne({ userId: interaction.user.id });

    return await interaction.editReply({ content: 'Tu cumpleaños ha sido eliminado.\nPuedes registrarlo nuevamente usando el comando **/birthday set**' });

  } catch (e) {
    console.log('Ocurrió un error al intentar quitar un cumpleaños');
    console.error(e);
    await interaction.editReply({ content: 'Ocurrió un error con esta interacción.\n¡Por favor inténtalo más tarde!' });
  }
}