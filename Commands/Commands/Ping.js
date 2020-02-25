const { Message, MessageEmbed } = require('discord.js');
const path = require('path');

const pingEmbed = (millis, wsPing) => {
  return new MessageEmbed()
    .setTitle(`Latencias:`)
    .setColor("GREEN")
    .addFields(
      { name: "Enviar y recibir el mensaje:", value: `${millis}ms` },
      { name: "Websocket:", value: `${wsPing}ms` }
    );
}

module.exports = {
  name: "ping",
  aliases: [],
  usage: "ping <Sin Parámetros>",
  description: "Latencia entre el bot y la API de Discord.",
  nsfw: false,
  enabled: true,
  permissions: [],
  filename: path.basename(__filename),

  async execute(message = new Message(), args = new Array()) {
    const { channel, client: Muki } = message;
    const wsPing = Muki.ws.ping;

    const now = Date.now();
    const sendedMessage = await channel.send('Bloop');
    const millis = sendedMessage.createdTimestamp - now;

    return await sendedMessage.edit(sendedMessage.content, { embed: pingEmbed(millis, wsPing) });
  }
}
