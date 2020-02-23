const { MessageEmbed, Message } = require('discord.js');

const noVoiceChannel = (author) =>
  new MessageEmbed()
    .setTitle(`🎙 = ❌`)
    .setDescription(`${author}, no estoy en ningún canal de voz.`)
    .setColor("RED");


const noMemberVoiceChannel = (author) =>
  new MessageEmbed()
    .setTitle(`No estás en un canal de voz.`)
    .setDescription(`${author}, solo puedes usar este comando estando en un canal de voz.`)
    .setColor("BLUE");

const differentChannel = (author) =>
  new MessageEmbed()
    .setTitle('❕')
    .setDescription(`${author}, debes estar en el mismo canal de voz que yo.`)
    .setColor("RED")

module.exports = {
  name: "disconnect",
  filename: __filename,
  aliases: [],
  description: "Me desconecta del canal de voz, si es que estoy en uno.",
  usage: "disconnect <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { author, channel, member, guild } = message;

    if (!guild.voice) return await channel.send(noVoiceChannel(author));
    if (!member.voice.channel) return await channel.send(noMemberVoiceChannel(author));
    if (member.voice.channelID !== guild.me.voice.channelID) return await channel.send(differentChannel(author));

    if (guild.voice.connection) {
      guild.voice.connection.disconnect();
      /*if (guild.voice.connection.dispatcher) {
        guild.voice.connection.dispatcher.end();
      } */
    }
    return await channel.send('👋');
  }
}