const path = require('path')
const { Message, MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
  name: "test",
  description: "test command",
  usage: "test",
  aliases: [],
  permissions: [],
  nsfw: false,
  enabled: true,
  filename: path.basename(__filename),
  cooldown: 10,
  botOwnerOnly: true,
  guildOnly: false,
  moderationOnly: false,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { channel } = message;
    return channel.send('OK!');

    /*    return channel.send(new MessageEmbed()
         .setTitle("Aqui está tu imagen!")
         .attachFiles(new MessageAttachment(buff, "test.png"))
         .setThumbnail("attachment://test.png")
         .setColor("BLUE")); */
  }
}