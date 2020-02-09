/**
 * Moans Handler
 * Fun command.
 */
const DEFAULTVOLUME = 0.13;
const Moaning = {};
const { Message } = require('discord.js');
module.exports = async (message = new Message()) => {
  const { guild, member } = message;
  if (Moaning[guild.id]) return;

  if (!member.voice.channel) await message.reply("tienes que estar en un canal de voz!");
  if (!member.voice.channel.joinable) await message.reply("no puedo entrar al canal de voz!\nPor favor revisa mis permisos.");
  const connection = await member.voice.channel.join();
  const dispatcher = connection.play('Modules/Music/Moans/test.mp3', {volume:0.10, bitrate:96000});

  dispatcher.on('end', () => {
    console.log(`Ended`);
    Moaning[guild.id] = false;
    connection.disconnect();
  });

  dispatcher.on('start', () => {
    console.log(`Started moaning on ${guild.name} canal ${guild.me.voice.channel.name}`);
    Moaning[guild.id] = true;
  });
}
