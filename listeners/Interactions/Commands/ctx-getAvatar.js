const { ContextMenuCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(2)
    .setDefaultPermission(true),
  isGlobal: true,
}