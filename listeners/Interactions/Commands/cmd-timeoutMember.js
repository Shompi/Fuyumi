const { CommandInteraction, Permissions, GuildMember } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

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

    if (interaction.memberPermissions.any(['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MODERATE_MEMBERS'])) {

      if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) {
        return await interaction.reply({ content: 'No puedo ejecutar este comando por que me falta el permiso de "MODERAR_MIEMBROS"', ephemeral: true });
      }

      const timeoutSeconds = interaction.options.getInteger('segundos') * 1000 ?? 60_000;
      const target = interaction.options.getMember('miembro');
      const timeoutReason = interaction.options.getString('razon') ?? "No se especificó una razón.";

      await target.fetch();
      if (target.permissions.has('ADMINISTRATOR'))
        return await interaction.reply({ content: 'No puedes silenciar a este miembro por que tiene permisos de Administrador.', ephemeral: true });

      const muted = await target.timeout(timeoutSeconds, timeoutReason).catch(console.error);

      if (!muted)
        return await interaction.reply({ content: 'No pude silenciar a este miembro.', ephemeral: true });

      await interaction.reply({
        content: `El miembro <@${target.id}> ha sido silenciado con éxito por ${timeoutSeconds / 1000} segundos.`,
        ephemeral: true
      });

    } else {
      await interaction.reply({ content: 'No tienes los suficientes permisos para usar este comando', ephemeral: true });
    }
  }
}