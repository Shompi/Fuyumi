//Nekos.life API
const { Message, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const notNSFW = new MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");


const ErrorEmbed = (response) => {
  return new MessageEmbed()
    .setTitle("Error en la API")
    .setColor("RED")
    .setDescription(`Codigo de error: ${response.status}`);
}

const imageEmbed = (author, data) => {
  return new MessageEmbed()
    .setImage(data.url)
    .setColor("LUMINOUS_VIVID_PINK")
    .setFooter(`${author.tag} - Powered by Nekos.life`, author.displayAvatarURL({ size: 128 }));
}

module.exports = async (message = new Message(), endpoint) => {
  //Check if channel is NSFW
  const { channel, author } = message;
  if (!channel.nsfw) return await channel.send(notNSFW);

  try {
    let response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
    if (!response.ok) return await channel.send(ErrorEmbed(response));

    const data = await response.json();

    return await channel.send(imageEmbed(author, data));

  } catch (err) {
    console.log("Ha ocurrido un error en Nekos.life");
    console.log(err);
    let Embed = new MessageEmbed().setTitle("Error en API Nekos.life").setDescription("Hubo un error con la api de Nekos.life, por favor avisale a ShompiFlen#3338").setColor('RED');
    return await channel.send(Embed);
  }
}


