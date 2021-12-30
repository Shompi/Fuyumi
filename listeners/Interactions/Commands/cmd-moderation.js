const { CommandInteraction, Permissions, GuildMember } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TimeoutMember } = require('./SubCommands/moderation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moderacion')
    .setDescription('Comandos de moderación')
    .addSubcommand(command => {
      return command.setName('timeout')
        .setDescription('Silencia al usuario no permitiendole interactuar ni conectar a canales de voz.')
        .addUserOption(inputUser => {
          return inputUser.setName('miembro')
            .setDescription('El miembro al que quieres silenciar.')
            .setRequired(true)
        })
        .addIntegerOption(segundos => {
          return segundos.setName('segundos')
            .setDescription('Tiempo en segundos por el cual quieres silenciar a este miembro.')
            .setMinValue(1)
            .setRequired(false)
        })
        .addStringOption(reason => {
          return reason.setName('razon')
            .setDescription('La razón por la que silenciarás a este miembro.')
            .setRequired(false)
        })
    }),
  isGlobal: true,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    // Check for moderation perms
    if (interaction.memberPermissions.any(['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MODERATE_MEMBERS'])) {

      const commandName = interaction.options.getSubcommand();

      switch (commandName) {
        case 'timeout':
          return await TimeoutMember(interaction);
      }


    } else {
      await interaction.reply({ content: 'No tienes los suficientes permisos para usar este comando. Necesitas al menos uno de los siguientes permisos: [Administrador, Expulsar Miembros, Prohibir Miembros, Moderar Miembros]', ephemeral: true });
    }
  }
}