const { MessageEmbed, VoiceState, Client } = require('discord.js');
const getImage = require('../getImage');
const database = require('../../LoadDatabase');
const horas = 1000 * 60 * 60 * 2; // 2 Horas.

module.exports = async (old = new VoiceState(), now = new VoiceState(), Muki = new Client()) => {
  if (old.streaming && now.streaming) return;
    const channel = now.guild.channels.find(ch => ch.type == 'text' && ch.name == 'directos');
  if (!channel) return;
  const activity = now.member.presence.activity;
  const voiceChannel = now.member.voice.channel;
  const image = activity ? getImage(activity.name) : getImage('Actividad Desconocida');
  const streamEmbed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setTitle(`${now.member.nickname ? now.member.nickname : now.member.user.tag} ha comenzado a transmitir ${activity ? activity.name : 'Actividad Desconocida'} en el canal ${voiceChannel.name}!`)
    .setThumbnail(now.member.user.displayAvatarURL({ size: 256 }))
    .setImage(image);
  await channel.send(streamEmbed);
  return;
}