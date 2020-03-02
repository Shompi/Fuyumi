const path = require('path')
const { Message, MessageAttachment, MessageEmbed } = require('discord.js');

const buff = Buffer.from(b64String, "base64");
module.exports = {
  name: "test",
  description: "test command",
  usage: "test",
  aliases: [],
  permissions: [],
  nsfw: false,
  enabled: true,
  filename: path.basename(__filename),
  execute(message = new Message(), args = new Array()) {
    const { channel } = message;


    return channel.send(new MessageEmbed()
      .setTitle("Aqui está tu imagen!")
      .attachFiles(new MessageAttachment(buff, "test.png"))
      .setThumbnail("attachment://test.png")
      .setColor("BLUE"));
  }
}