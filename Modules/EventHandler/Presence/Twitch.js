const { MessageEmbed, Presence } = require('discord.js');
module.exports = async (old = new Presence(), now = new Presence()) => {
  if (now.user.bot) return;
  if (!now.activities.length == 0) return;
  const activity = now.activities[0];
  if (activity.type !== 'STREAMING') return;

  if (isStreaming) return;

  const streamingChannel = now.member.guild.channels.find(channel => channel.name == "directos" && channel.type == 'text');
  if (!streamingChannel) return console.log("No se encontró canal de streamings.");

  const embed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setThumbnail(`${now.member.user.displayAvatarURL({size:256})}`)
    .setTitle(`¡${old.member.displayName} está en vivo en ${activity.name}!`)
    .setDescription(`**${activity.details}**\nÚnete a la transmisión en ${activity.url || "NO URL"}`)
    .setTimestamp()

  return await streamingChannel.send(embed);
}