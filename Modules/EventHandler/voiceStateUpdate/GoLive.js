const { MessageEmbed, VoiceState, Collection, Client } = require('discord.js');
const keyv = require('keyv');
const db = new keyv("sqlite://./Databases/Streamings/streamings.sqlite");
db.on('error', error => console.log(error));

module.exports = async (old = new VoiceState(), now = new VoiceState(), Muki = new Client()) => {
  const isStreaming = await db.get(now.id);
  if (isStreaming) return;
  if (now.streaming && !old.streaming) {
    await db.set(now.id, 'streaming', 1000*60*60*2);
    const channel = now.guild.channels.find(ch => ch.type == 'text' && ch.name == 'directos');
    if (!channel) return;
    const activity = now.member.presence.activity;

    const streamEmbed = new MessageEmbed()
      .setColor(now.member.displayColor)
      .setTitle(`${now.member.nickname ? now.member.nickname : now.member.user.tag} ha comenzado a transmitir ${activity ? activity.name : 'Actividad Desconocida.'} en ${now.guild.name}!`)
      .setThumbnail(now.member.user.displayAvatarURL({ size: 256 }))
    await channel.send(streamEmbed);
    return;
  }
}
