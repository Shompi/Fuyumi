const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ServerInfo } = require('./SubCommands/info-server');
const { UserInfo } = require('./SubCommands/info-user');
const { RoleInfo } = require('./SubCommands/info-role');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Comandos de información general')
    .addSubcommand(guildInfo => {
      return guildInfo
        .setName('server')
        .setDescription('Información del servidor');
    })
    .addSubcommand(subcommand => {
      return subcommand.setName('user')
        .setDescription('Info de un usuario dentro de este servidor')
        .addUserOption(user => {
          return user.setName('usuario')
            .setDescription('El usuario del que quieres ver la info, default: Tú')
            .setRequired(false)
        })
    })
    .addSubcommand(roleInfo => {
      return roleInfo.setName('role')
        .setDescription('Información acerca de un rol de este servidor')
        .addRoleOption(role => {
          return role.setName('rol')
            .setDescription('El rol que quieres ver')
            .setRequired(true)
        })
    }),
  isGlobal: true,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const commandName = interaction.options.getSubcommand();

    switch (commandName) {
      case 'server':
        ServerInfo(interaction);
        break;
      case 'user':
        UserInfo(interaction);
        break;
      case 'role':
        RoleInfo(interaction);
        break;
    }
  }
}