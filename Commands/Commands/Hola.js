const { Message, MessageEmbed } = require('discord.js');
const { basename } = require('path');

const CurrentlyPlaying = new Set();

module.exports = {
  name: "hola",
  aliases: ["hello"],
  permissions: ["CONNECT, SPEAK"],
  description: "Reproduce un clip en el canal de voz en el que estás.",
  usage: "hola",
  nsfw: false,
  enabled: true,
  guildOnly: true,
  filename: basename(__filename),
  async execute(message = new Message(), args = new Array()) {
    const { guild, channel, member } = message;

    if (!member.voice.channel) return channel.send(`${member} debes estar en un canal de voz!`);
    if (!guild.me.hasPermission(this.permissions)) return channel.send(`¡Me faltan permisos!\n${member} asegurate de que tengo los permisos de voz **"CONECTAR"** y **"HABLAR"**.`);

    try {
      const connection = await member.voice.channel.join();
      connection.play('Commands/Hola/hola.mp3', { volume: 0.15, highWaterMark: 1 << 6 })
        .on('start', () => {
          CurrentlyPlaying.add(guild.id);
        })
        .on('finish', () => {
          return member.voice.channel.leave();
        })
        .on('error', error => {
          CurrentlyPlaying.delete(guild.id);
          console.error(error);
        });

    } catch (e) {
      console.log(e);
      await member.voice.channel.leave();
      return channel.send("Ocurrió un error al intentar ejecutar este comando.");
    }
  }
}