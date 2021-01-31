'use strict'

const { basename } = require('path')
const { MessageEmbed, Message } = require('discord.js');
module.exports = {
  name: "support",
  aliases: ["supportserver", "supportguild", "helpserver", "helpguild"],
  filename: basename(__filename),
  usage: "support",
  description: "Enlace de invitación al servidor oficial de Muki.",
  enabled: true,
  cooldown: 10,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  async execute(message, args) {
    const { channel, member, client: Muki } = message;

    const support = Muki.guilds.cache.get(Muki.SUPPORTGUILD);
    const invites = await support.fetchInvites();

    const inviteURL = invites.find(inv => inv.temporary);
    const supportEmbed = new MessageEmbed()
      .setTitle('¿Tienes problemas o alguna sugerencia?')
      .setDescription(`¡Te invito a mi servidor para que puedas hablar con ShompiFlen!\n[¡Click aquí para unirte al servidor de soporte!](${inviteURL})`)
      .setColor("BLUE")
      .setThumbnail(support.iconURL({ size: 512, dynamic: true }));

    return channel.send(supportEmbed);
  }
}