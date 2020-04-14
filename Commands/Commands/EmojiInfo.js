const { basename } = require('path');
const { MessageEmbed, Message } = require('discord.js');

const noArgs = (author) =>
  new MessageEmbed()
    .setColor("BLUE")
    .setDescription(`${author} el argumento debe ser un emoji.`);

const notValidEmoji = new MessageEmbed()
  .setTitle(`❌ No has ingresado un custom Emoji.`)
  .setDescription("¿Intentaste usar un emoji normal?, este comando solo funciona con Emojis Customs, ¡Lo siento!")
  .setColor("RED");

module.exports = {
  name: "emoji",
  usage: "emoji [Emoji]",
  description: "Muestra la información de un Emoji.",
  aliases: [],
  permissions: [],
  enabled: true,
  nsfw: false,
  guildOnly: false,
  adminOnly: false,

  execute(message = new Message(), args = new Array()) {

    const { channel, author, client: Muki, content } = message;

    if (args.length === 0)
      return channel.send(noArgs(author));

    const regexp = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;

    /*
    The returned array from String.match will contain the emoji id in the third element.
    */

    const emojiID = content.match(regexp);

    if (!emojiID)
      return channel.send(notValidEmoji);

    const emoji = Muki.emojis.cache.get(emojiID[3]);

    if (!emoji)
      return channel.send(`No tengo acceso a ese emoji :(`);

    const embed = new MessageEmbed()
      .setTitle(`${emoji.name} (${emoji.id})`)
      .setDescription(
        `**Identificador:** ${emoji.identifier}\n**Animado:** ${emoji.animated}\n**Imágen:** [Click Aqui](${emoji.url})`
      )
      .setColor("BLUE")
      .setThumbnail(emoji.url)

    return channel.send(embed);
  }
}