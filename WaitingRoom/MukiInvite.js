const { Message, MessageEmbed } = require('discord.js');
const path = require('path');

const invitation = (invite) =>
  new MessageEmbed()
    .setTitle(`📩 ¡Invítame a tu servidor!`)
    .setDescription(`[->Haz click aquí<-](${invite})`)
    .setColor("BLUE");

module.exports = {
  name: "invite",
  filename: path.basename(__filename),
  description: "¡Mi enlace de invitación para que me invites a otros servidores!",
  usage: "invite <Sin Parámetros>",
  enabled: true,
  nsfw: false,
  aliases: ['inv'],
  permissions: [],
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  async execute(message, args) {
    const { channel, client } = message;
    const invite = await client.generateInvite(607177824);
    return channel.send(invitation(invite))
  }
}