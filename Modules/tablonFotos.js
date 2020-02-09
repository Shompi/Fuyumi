const { Webhook, MessageEmbed, Message } = require('discord.js');
module.exports = async (message = new Message(), webHook = new Webhook()) => {
  try {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setImage(message.content)
      .setFooter(`Enviado por ${message.author.tag}`, message.author.displayAvatarURL);
    await webHook.send(embed);
  } catch (error) {
    console.log("Hubo un error con Tablon Hook:");
    console.log(error);
  }
}