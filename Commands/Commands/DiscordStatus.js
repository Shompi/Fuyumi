const { MessageEmbed, Message } = require('discord.js');
let infopage = require('../../Classes/statusTemplate');
const endpoint = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json';
const fetch = require('node-fetch');

const connectionError = new MessageEmbed()
  .setColor('RED')
  .setAuthor('Discord Status')
  .setDescription('Hubo un error con la conexión.');

module.exports = {
  name: "dstatus",
  description: "Muestra el estado de la API de Discord (desde statuspage.io).",
  usage: "dstatus <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {

    const { channel } = message;
    infopage = await fetch(endpoint)
      .then(response => response.json())
      .catch(error => channel.send(connectionError));

    const indicator = infopage.status.indicator;
    let infoEmbed = new MessageEmbed().setAuthor("Discord Status", null, infopage.page.url);
    //indicators none, minor, major, or critical,
    if (indicator == 'none') infoEmbed.setColor("GREEN");
    if (indicator == 'minor') infoEmbed.setColor("YELLOW");
    if (indicator == 'major') infoEmbed.setColor("ORANGE");
    if (indicator == 'critical') infoEmbed.setColor("RED");

    infoEmbed.setDescription(infopage.status.description);

    return await channel.send(infoEmbed);
  }
}