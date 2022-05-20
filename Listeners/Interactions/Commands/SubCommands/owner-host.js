const { CommandInteraction, Activity } = require("discord.js");
const keyv = require('keyv');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' });

/**
 * @param {CommandInteraction} interaction 
 */
module.exports.Host = async (interaction) => {

  if (interaction.inCachedGuild()) {
    const member = interaction.options.getMember('usuario');
    const streamURL = interaction.options.getString('url');

    if (member) {
      const memberActivity = member.presence.activities.find(activity => activity.type === 'STREAMING');

      /** @type {Activity} */
      const activity = {
        name: memberActivity.details,
        type: 'STREAMING',
        url: memberActivity.url,
      }

      interaction.client.user.setActivity(activity);
      await lastPresence.set('0', activity);

      await interaction.reply(`¡La actividad se ha cambiado!`);
    } else if (streamURL) {
      if (!interaction.options.getString('titulo'))
        return await interaction.reply('Debes ingresar un titulo para esta actividad.');

      /** @type {Activity} */
      const activity = {
        name: interaction.options.getString('titulo'),
        type: 'STREAMING',
        url: streamURL
      }

      interaction.client.user.setActivity(activity);
      await lastPresence.set('0', activity);

      await interaction.reply('¡La actividad se ha cambiado!');
    }
  }
}