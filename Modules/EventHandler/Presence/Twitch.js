const { MessageEmbed, Presence } = require('discord.js');
const database = require('../../LoadDatabase');
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
  const activity = now.activities[0];
  if (!activity) return console.log(`El usuario ${now.user.tag} no tiene actividades`);
  if (activity.type !== 'STREAMING') return;

  const streamingChannel = now.member.guild.channels.find(channel => channel.name == "directos" && channel.type == 'text');
  if (!streamingChannel) return console.log("No se encontró canal de streamings.");
  const image = getImage(activity.state) || getImage(now.activities[1].name);
  const embed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setThumbnail(`${now.member.user.displayAvatarURL({size:256})}`)
    .setTitle(`¡${old.member.displayName} está en vivo en ${activity.name}!`)
    .setDescription(`**${activity.details}**\nÚnete a la transmisión en ${activity.url || "NO URL"}`)
    .setTimestamp()
    .setImage(image);

  return await streamingChannel.send(embed);
}