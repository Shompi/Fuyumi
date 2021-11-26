const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(2),
}