/**
 * Moans Handler
 * Fun command.
 */
const Moaning = {};
const { Message } = require('discord.js');
//const fs = require('fs');
//const Moans = fs.readdirSync('../Music/Moans').filter(file => file.endsWith('.mp3'));

module.exports = {
  name: "moan",
  description: "😏",
  usage: "moan <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: ["SPEAK"],
  async execute(message = new Message(), args = new Array()) {
    const { guild, member } = message;

    if (Moaning[guild.id]) return;

    if (!member.voice.channel) return await message.reply("tienes que estar en un canal de voz!");
    if (!member.voice.channel.joinable) return await message.reply("no puedo entrar al canal de voz!\nPor favor revisa mis permisos.");
    const connection = await member.voice.channel.join();
   // const dispatcher = connection.play('Modules/Music/Moans/test.mp3', { volume: 0.50, bitrate: 96000 });

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
}
