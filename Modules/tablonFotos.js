const { Webhook, MessageEmbed, Message } = require('discord.js');
module.exports = async (message = new Message(), webHook = new Webhook()) => {
  const embed = new MessageEmbed()
    .setColor("BLUE")
    .setImage(message.content)
    .setFooter(`Enviado por ${message.author.tag}`, message.author.displayAvatarURL);
  return await webHook.send(embed).catch(error => {
    console.log(error);
    console.log("^^^^ Error en tablonFotos.js");
  });

}