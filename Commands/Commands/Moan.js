const Moaning = new Set();
const { Message, MessageEmbed, VoiceConnection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const clips = fs.readdirSync("Commands/Music/Moans").filter(file => file.endsWith('.mp3'));


const speakPermission = (author) =>
  new MessageEmbed()
    .setTitle('❌ Permisos Insuficientes.')
    .setDescription(`${author} necesito el permiso 'SPEAK'.`)
    .setColor("RED");

const connectPermission = (author) =>
  new MessageEmbed()
    .setTitle('❌ Permisos Insuficientes.')
    .setDescription(`${author} necesito el permiso 'CONNECT'.`)
    .setColor("RED");

const noMemberVoiceChannel = (author) =>
  new MessageEmbed()
    .setTitle(`No estás en un canal de voz.`)
    .setDescription(`${author}, solo puedes usar este comando estando en un canal de voz.`)
    .setColor("BLUE");


module.exports = {
  name: "moan",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "😏",
  usage: "moan <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: ["gemir", "gemidos"],
  permissions: ["SPEAK", "CONNECT"],
  async execute(message = new Message(), args = new Array()) {
    const { guild, member, author, channel } = message;
    if (Moaning.has(guild.id)) return undefined;
    if (clips.length === 0) return channel.send("No hay archivos para reproducir.");

    if (Moaning.has(guild.id)) return;
    if (!guild.me.hasPermission('SPEAK')) return channel.send(speakPermission(author));
    if (!member.voice.channel) return message.reply(noMemberVoiceChannel(author));
    if (!member.voice.channel.joinable) return message.reply(connectPermission(author));

    const connection = await member.voice.channel.join();
    channel.send(`😏`);
    PlayMoan(connection, message, clips);
  }
}

const PlayMoan = (connection = new VoiceConnection(), message, clips) => {
  const { guild } = message;
  const clip = clips[Math.floor(Math.random() * clips.length)];

  const dispatcher = connection.play(`Commands/Music/Moans/${clip}`, { bitrate: 96000, volume: 0.75, highWaterMark: 1 << 10 });

  dispatcher.on('finish', () => {
    console.log("Finished");
    setTimeout(() => {
      Moaning.delete(guild.id)
      console.log("guild deleted");
      connection.disconnect();
    }, 1500);
  })

  dispatcher.on('error', (error) => {
    Moaning.delete(guild.id);
    console.log("ERROR")
    console.log(error);
    connection.disconnect();
  });

  dispatcher.on('start', () => {
    Moaning.add(guild.id);
  });

}
