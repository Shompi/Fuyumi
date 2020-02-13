const getImage = require('./getImage');
const { MessageEmbed, VoiceState } = require('discord.js');

const sendStreaming = async (now = new VoiceState()) => {
  const embed = await constructEmbed(now);
  if (!embed) return null;
  const channel = now.guild.channels.cache.find(ch => ch.type == 'text' && ch.name == 'directos');
  if (!channel) return;
  return channel.send(embed);
}

const constructEmbed = async (now = new VoiceState()) => {
  const activity = now.member.presence.activities[0];
  console.log(activity);
  const voiceChannel = now.member.voice.channel;
  if (!voiceChannel) return null;
  const image = activity ? getImage(activity.name) : getImage('Actividad Desconocida');
  const streamEmbed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setTitle(`¡${now.member.nickname ? now.member.nickname : now.member.user.tag} ha comenzado a transmitir ${activity ? activity.name : 'Actividad Desconocida'} en el canal ${voiceChannel.name}!`)
    .setThumbnail(now.member.user.displayAvatarURL({ size: 256 }))
    .setImage(image);
  return streamEmbed;
}

module.exports = { sendStreaming, constructEmbed };