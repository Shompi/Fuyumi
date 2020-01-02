//Nekos.life API
const {Message, MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
module.exports = async (message = new Message(), endpoint) => {
  try {
    let response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
    if (!response.ok) {
      const ErrorEmbed = new MessageEmbed()
        .setTitle("Error en la API")
        .setColor("RED")
        .setDescription(`Codigo de error: ${response.status}`);
      return await message.channel.send(ErrorEmbed);
    }
    const data = await response.json();
    const embed = new MessageEmbed()
      .setImage(data.url)
      .setColor("LUMINOUS_VIVID_PINK")
      .setFooter(`${message.author.tag} - Powered by Nekos.life`, message.author.displayAvatarURL({size:128}));
    return await message.channel.send(embed);
  } catch (err) {
    let Embed = new MessageEmbed().setTitle("Error en API Nekos.life").setDescription("Hubo un error con la api de Nekos.life, por favor avisale a ShompiFlen#3338").setColor('RED');
    await message.channel.send(Embed);
    console.log("Ha ocurrido un error en Nekos.life");
    console.log(err);
  }
}


