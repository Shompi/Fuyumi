//@ts-check
const { ChatInputCommandInteraction, Activity, ActivityType } = require('discord.js');
const keyv = require('keyv');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' });

const ActivityTypes = {
  PLAYING: ActivityType.Playing,
  WATCHING: ActivityType.Watching,
  LISTENING: ActivityType.Listening,
}


/**
 * @param {ChatInputCommandInteraction} interaction 
 */
module.exports.Activity = async (interaction) => {

  /** @type {Activity} */
  const pastActivity = await lastPresence.get('0');

  const resolvedType = ActivityTypes[interaction.options.getString('tipo', false) ?? "PLAYING"];

  const newActivity = {
    name: interaction.options.getString('nombre') ?? pastActivity.name,
    type: resolvedType
  };

  interaction.client.user?.setActivity(newActivity);
  await lastPresence.set('0', newActivity);
  return await interaction.reply(`¡La actividad ${newActivity.type} ${newActivity.name} se ha guardado!`);
}
