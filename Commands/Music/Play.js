/**
 * Youtube Player
 */
const ytdl = require('ytdl-core-discord');
const { google } = require('googleapis');
const { Message, VoiceConnection } = require('discord.js');
const GUILDS = new Map();

module.exports = async (message = new Message(), content = new String()) => {
  const { guild, member } = message;
  let guildMusic = GUILDS.get(guild.id);
  console.log(`Guild Music: ${guildMusic}`);
  if (!guildMusic) guildMusic = {isPlaying: false, queue: [], id:guild.id};
  
  if (guildMusic.isPlaying) {
    guildMusic.queue.push(content);
    GUILDS.set(guild.id, guildMusic);
    return await message.channel.send("El video ha sido añadido a la lista!");
  }

  try {
    if (!member.voice.channel) return await message.reply("¡debes estar en un canal de voz!");
    if (!member.voice.channel.joinable) return await message.reply("¡No puedo entrar al canal de voz en el que estás!\nPor favor revisa mis permisos.");
    let VoiceConnection = await member.voice.channel.join();
    if (content.startsWith("https://www.youtu.be") || content.startsWith("https://www.youtube.com/") || content.startsWith("https://youtube.com/") || content.startsWith("https://youtu.be")) {
      //YTDL
      guildMusic.queue.push(content);
      console.log(guildMusic);
      GUILDS.set(guild.id, guildMusic);
      playSong(VoiceConnection, guild.id);
      return;
    } else {
      //Google Apis
    }


  } catch (error) {
    await message.channel.send('Hubo un error con el comando.\n¡Por favor avisale a **ShompiFlen#3338**!');
    console.log(error);
  }
}

const playSong = async(connection = new VoiceConnection(), guildID) => {
  const guildMusic = GUILDS.get(guildID);
  const url = guildMusic.queue[0];
  console.log(url);
  const dispatcher = connection.play(await ytdl(url), { type: 'opus', volume: 0.13, bitrate:96000, highWaterMark: 1 << 25});

  dispatcher.on('start', () => {
    console.log("Music started");
    guildMusic.queue.shift();
    guildMusic.isPlaying = true;
    GUILDS.set(guildID, guildMusic);
  });

  dispatcher.on('end', () => {
    console.log("Music ended");
    const guildMusic = GUILDS.get(guildID);
    if (guildMusic.queue.length >= 1) return playSong(connection, guildMusic.id)
    guildMusic.isPlaying = false;
    GUILDS.set(guildID, guildMusic);
    return;
  });

  dispatcher.on('error', err => console.log(err));
  dispatcher.on('debug', info => console.log(info));

}