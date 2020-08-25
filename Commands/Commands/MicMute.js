const { Message, MessageEmbed, GuildMember } = require('discord.js');
const path = require('path');

const infoEmbed = (author, guild, reason) =>
  new MessageEmbed()
    .setThumbnail(author.displayAvatarURL({ size: 256 }))
    .setColor("RED")
    .setTitle(`${author.tag} te ha silenciado en ${guild.name}!`)
    .setDescription(`**Motivo:** ${reason || "Sin motivo."}\nHablale para que te desmutee!`)
    .setTimestamp();

const noTarget = (author) =>
  new MessageEmbed()
    .setTitle(`❌ ${author.username} no has mencionado a ningún miembro.`)
    .setColor("RED");

module.exports = {
  name: "mute",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Silencia / De-silencia el micrófono de un miembro que esté en un canal de voz.",
  usage: "mute [@Mención de miembro]",
  nsfw: false,
  enabled: false,
  aliases: [],
  permissions: ["MUTE_MEMBERS"],

  async execute(message = new Message(), args = new Array()) {
    const { channel, guild, mentions, author } = message;

  } 
}
