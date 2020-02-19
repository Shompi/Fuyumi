const { MessageEmbed, TextChannel } = require('discord.js');
let infopage = require('../../Classes/statusTemplate');
const endpoint = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json';
const fetch = require('node-fetch');
module.exports = async (channel = new TextChannel()) => {

  infopage = await fetch(endpoint).then(response => response.json()).catch(error => {
    const embed = new MessageEmbed().setColor('RED').setAuthor('Discord Status').setDescription('Hubo un error con la conexión.');
    return channel.send(embed).then(console.log(error));
  });
  
  const indicator = infopage.status.indicator;
  let infoEmbed = new MessageEmbed().setAuthor("Discord Status", null, infopage.page.url);
  //indicators none, minor, major, or critical,
  if (indicator == 'none') infoEmbed.setColor("GREEN");
  if (indicator == 'minor') infoEmbed.setColor("YELLOW");
  if (indicator == 'major') infoEmbed.setColor("ORANGE");
  if (indicator == 'critical') infoEmbed.setColor("RED");

  infoEmbed.setDescription(infopage.status.description);

  return await channel.send(infoEmbed).catch(console.error);
}