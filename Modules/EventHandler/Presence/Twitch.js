const { MessageEmbed, Client, Presence } = require('discord.js');
const getImage = require('../getImage')
const keyv = require('keyv');
const streamings = new keyv('sqlite://./Databases/Streamings/streamings.sqlite');
streamings.on('error', (err) => console.log(err));
module.exports = async (old = new Presence(), now = new Presence()) => {
  if (now.user.bot) return;
  if (!now.activity) return;
  if (now.activity.type !== 'STREAMING') return;
  const isStreaming = await streamings.get(now.user.id);
  if (isStreaming) return;

  const streamingChannel = now.member.guild.channels.find(channel => channel.name == "directos" && channel.type == 'text');
  if (!streamingChannel) return console.log("No se encontró canal de streamings.");
  const image = getImage(now.activity.state);
  const embed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setThumbnail(`${now.member.user.displayAvatarURL({size:256})}`)
    .setTitle(`¡${old.member.displayName} ha comenzado a transmitir ${now.activity.state} en ${now.activity.name}!`)
    .setDescription(`**${now.activity.details}**\nÚnete a la transmisión en ${now.activity.url || "NO URL"}`)
    .setTimestamp()
    .setImage(image);

  await streamingChannel.send(embed);
  return await streamings.set(now.user.id, 'streaming', 1000 * 60 * 60 * 2);
}
