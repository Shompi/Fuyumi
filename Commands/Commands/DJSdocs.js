const { Message } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: "docs",
  description: "Documentación de Discord.js",
  usage: "docs [Query string] [stable/master/commando]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { channel } = message;
    const content = message.content.replace(/\s+/g, " ").split(" ");
    const project = content[2] || "stable";
    const queryString = content[1];
    if (!queryString) return await channel.send("Necesitas ser más especifico.");
    const endpoint = `https://djsdocs.sorta.moe/v2/embed?src=${project}&q=${queryString}`
    fetch(endpoint)
      .then(res => res.json())
      .then(docs => channel.send(null, { embed: docs }))
      .catch(console.error);
  }
}