const { Message, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const path = require('path');

const TimedOut = (error) =>
  new MessageEmbed()
    .setTitle(`Error en el request: ${error.code}`)
    .setDescription("Inténtalo más tarde.")
    .setColor("RED");

module.exports = {
  name: "docs",
  filename: path.basename(__filename),
  description: "Documentación de Discord.js",
  usage: "docs [Query string] [stable/master/commando]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { channel, id, client: Muki } = message;
    const content = message.content.replace(/\s+/g, " ").split(" ");
    const project = content[2] || "stable";
    const queryString = content[1];
    if (!queryString) return channel.send("Necesitas ser más especifico.");

    const endpoint = `https://djsdocs.sorta.moe/v2/embed?src=${project}&q=${queryString}`
    fetch(endpoint)
      .then(res => res.json())
      .then(async (docs) => {

        if (Muki.Messages.has(message.id)) {
          const mukimsg = Muki.Messages.get(message.id);
          return mukimsg.muki.edit(null, { embed: docs });
        }

        const sendedMsg = await channel.send(null, { embed: docs });
        const messagePair = {
          muki: sendedMsg,
          user: message
        }

        Muki.Messages.set(id, messagePair);
        setTimeout(() => {
          Muki.Messages.delete(id);
        }, 1000 * 60 * 3);
      })
      .catch(err => channel.send(TimedOut(err)));
  }
}