const { MessageEmbed, Message } = require('discord.js');
const endpoint = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json';
const fetch = require('node-fetch');
const path = require('path');

const connectionError = new MessageEmbed()
  .setColor('RED')
  .setAuthor('Discord Status')
  .setDescription('Hubo un error con la conexión.');

module.exports = {
  name: "dstatus",
  filename: path.basename(__filename),
  description: "Muestra el estado de la API de Discord (desde statuspage.io).",
  usage: "dstatus <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: ["Discord", "discordstatus"],
  permissions: [],
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { channel } = message;
    fetch(endpoint)
      .then(response => response.json())
      .then((infopage) => {
        const indicator = infopage.status.indicator;
        let infoEmbed = new MessageEmbed().setAuthor("Discord Status", null, infopage.page.url);
        //indicators none, minor, major, or critical,
        if (indicator == 'none') infoEmbed.setColor("GREEN");
        if (indicator == 'minor') infoEmbed.setColor("YELLOW");
        if (indicator == 'major') infoEmbed.setColor("ORANGE");
        if (indicator == 'critical') infoEmbed.setColor("RED");

        infoEmbed.setDescription(infopage.status.description);

        return channel.send(infoEmbed);
      })
      .catch(error => channel.send(connectionError));
  }
}