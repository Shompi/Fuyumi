const { Message, MessageEmbed } = require('discord.js');

const invitation = (invite) =>
  new MessageEmbed()
    .setTitle(`📩 Enlace de Invitación de Muki:`)
    .setDescription(`[Cliquea aquí](${invite})`)
    .setColor("BLUE");

module.exports = {
  name: "invite",
  filename: __filename,
  description: "Enlace de invitación para invitarme a otros servidores.",
  usage: "invite <Sin Parámetros>",
  enabled: true,
  nsfw: false,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { channel, client } = message;
    const invite = await client.generateInvite(607177824);
    return await channel.send(invitation(invite))
  }
}