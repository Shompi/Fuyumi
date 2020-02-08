const { MessageEmbed, Presence } = require('discord.js');
const database = require('../../LoadDatabase');
const TWOHOURS = 1000 * 60 * 60 * 2;
const getImage = require('../getImage');
module.exports = async (old = new Presence(), now = new Presence()) => {
  /**
   * 1.- Verificar que el usuario está stremeando
   * 2.- Verificar si el usuario estaba stremeando antes
   * 3.- Comparar la actividad anterior con la nueva:
   * >Si son iguales = retornar
   * >Si son distintas = Actualizar el mensaje relacionado con el primer livestream.
   */
  if (now.user.bot) return;
  const activity = now.activities.find(act => act.type === 'STREAMING');
  if (!activity) return console.log(`El usuario ${now.user.tag} no está stremeando Twitch / Youtube`);
  const oldActivity = old.activities.find(act => act.type === 'STREAMING');
  if (activity && oldActivity) return console.log(`${now.member.user.tag} ya estaba stremeando de antes.`);
  const streamingChannel = now.member.guild.channels.find(channel => channel.name == "directos" && channel.type == 'text');
  if (!streamingChannel) return console.log("No se encontró canal de streamings.");
  
  try {
    console.log(`User ${now.member.user.tag} is streaming on ${activity.name}`);
    const member = now.member;
    const timeNow = Date.now();
    if (database.streamings.has(member.id)) {
      //If the member is already in the database means that we already have a sended message... probably.
      const activityName = activity.state;
      const dbmember = database.streamings.get(member.id);
      console.log(`now: ${activityName} db: ${dbmember.activityName}`);
      if (activityName == dbmember.activityName) return console.log(`El usuario ${member.user.tag} ya estaba transmitiendo esta actividad`);

      const begun = database.streamings.get(member.id, 'streamStarted');

      if ((timeNow - begun) >= TWOHOURS) {
        await sendStreaming(now);
        const timeNow = Date.now();
        database.streamings.set(member.id, timenow, "streamStarted");
        return console.log(database.streamings.get(member.id));
      } else {
        //If the elapsed time is not greater than two hours then we need to return.
        return;
      }
    } else {
      //If the member was not in the database we need to add him in.
      await sendStreaming(now, activity);
      database.streamings.set(member.id, timenow, "streamStarted");
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

const sendStreaming = async (now = new Presence(), activity) => {
  //In this case, activity.state is the name of the game being played.
  const image = getImage(activity.state) || getImage('Actividad Desconocida');
  const embed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setThumbnail(`${now.member.user.displayAvatarURL({ size: 256 })}`)
    .setTitle(`¡${old.member.displayName} está en vivo en ${activity.name}!`)
    .setDescription(`**${activity.details}**\nÚnete a la transmisión en ${activity.url || "NO URL"}`)
    .setTimestamp()
    .setImage(image);

  return await streamingChannel.send(embed);
}