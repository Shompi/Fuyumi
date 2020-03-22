const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

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
  filename: path.basename(__filename),
  guildOnly: true,
  aliases: ['leave'],
  description: "Me desconecta del canal de voz, si es que estoy en uno.",
  usage: "disconnect <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { author, channel, member, guild } = message;

    if (!guild.voice) return channel.send(noVoiceChannel(author));
    if (!member.voice.channel) return channel.send(noMemberVoiceChannel(author));
    if (member.voice.channelID !== guild.me.voice.channelID) return channel.send(differentChannel(author));

    if (guild.voice.connection) {
      await guild.voice.channel.leave();
      return channel.send('👋');
    }
  }
}