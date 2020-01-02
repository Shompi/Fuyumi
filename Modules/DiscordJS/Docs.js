const {Message} = require('discord.js');
const fetch = require('node-fetch');
module.exports = (message = new Message()) => {
  const content = message.content.replace(/\s+/g," ").split(" ");
  const project = content[2] || "stable";
  const queryString = content[1];
  if(!queryString) return message.channel.send("Necesitas ser más especifico.");
  const endpoint = `https://djsdocs.sorta.moe/v2/embed?src=${project}&q=${queryString}`
  fetch(endpoint)
    .then(res => res.json())
    .then(docs => message.channel.send(null, {embed:docs}))
    .catch(console.error);
}