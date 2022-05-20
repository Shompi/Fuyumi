const { CommandInteraction, Activity } = require('discord.js');
const keyv = require('keyv');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' });

/**
 * @param {CommandInteraction} interaction 
 */
module.exports.Activity = async (interaction) => {

  /** @type {Activity} */
  const pastActivity = await lastPresence.get('0');

  /** @type {Activity} */
  const newActivity = {
    name: interaction.options.getString('nombre') ?? pastActivity.name,
    type: interaction.options.getString('tipo') ?? pastActivity.type
  };

  interaction.client.user.setActivity(newActivity);
  await lastPresence.set('0', newActivity);
  return await interaction.reply(`¡La actividad ${newActivity.type} ${newActivity.name} se ha guardado!`);
}
