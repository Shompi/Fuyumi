/**
 * Moans Handler
 * Fun command.
 */
const DEFAULTVOLUME = 0.13;
const Moaning = {};
const { Message } = require('discord.js');
module.exports = async (message = new Message()) => {

  if (Moaning[guild.id]) return;

  const { guild, member } = message;
  if (!member.voice.channel) await message.reply("tienes que estar en un canal de voz!");
  if (!member.voice.channel.joinable) await message.reply("no puedo entrar al canal de voz!\nPor favor revisa mis permisos.");
  const connection = await member.voice.channel.join();
  const dispatcher = connection.play('./Moans/test.mp3');

  dispatcher.on('end', () => {
    Moaning[guild.id] = false;
    connection.disconnect();
  })
  dispatcher.on('start', () => {
    Moaning[guild.id] = true;
    console.log(`Started moaning on ${guild.name} canal ${guild.me.voice.channel.name}`);
  })
}
