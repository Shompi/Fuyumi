/**
 * Moans Handler
 * Fun command.
 */
const Moaning = new Set();
const { Message, MessageEmbed, VoiceConnection } = require('discord.js');
const fs = require('fs');

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
  filename: __filename,
  description: "😏",
  usage: "moan <Sin Parámetros>",
  nsfw: false,
  enabled: false,
  aliases: [],
  permissions: ["SPEAK"],
  async execute(message = new Message(), args = new Array()) {
    const { guild, member, author, channel } = message;

    if (Moaning.has(guild.id)) return;
    if (!guild.me.hasPermission('SPEAK')) return await channel.send(speakPermission(author));
    if (!member.voice.channel) return await message.reply(noMemberVoiceChannel(author));
    if (!member.voice.channel.joinable) return await message.reply(connectPermission(author));

    const connection = await member.voice.channel.join();
    PlayMoan(connection, message);
  }
}

const PlayMoan = (connection = new VoiceConnection(), { guild }) => {

  const clips = fs.readdirSync("Commands/Music/Moans").filter(file => file.endsWith('.mp3'));
  const clip = clips[Math.floor(Math.random() * clips.length)];

  const dispatcher = connection.play(`Commands/Music/Moans/${clip}`, {bitrate: 96000, volume: 0.75, highWaterMark: 1<<10});
  
  dispatcher.on('end', () => {
    console.log(`Ended`);
    Moaning.delete(guild.id);
    connection.disconnect();
  });

  dispatcher.on('error', (error) => {
    Moaning.delete(guild.id);
    console.log("ERROR")
    console.log(error);
  });

  dispatcher.on('start', () => {
    Moaning.add(guild.id);
  });

}
