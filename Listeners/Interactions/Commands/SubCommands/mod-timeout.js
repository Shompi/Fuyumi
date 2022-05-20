//@ts-check
const { CommandInteraction, GuildMember } = require("discord.js");

/**
 * 
 * @param {CommandInteraction} interaction 
 * @returns 
 */

module.exports.TimeoutMember = async (interaction) => {
  if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) {
    return await interaction.reply({ content: 'No puedo ejecutar este comando por que me falta el permiso de "MODERAR_MIEMBROS"', ephemeral: true });
  }

  const timeoutSeconds = interaction.options.getInteger('segundos') * 1000 ?? 60_000;
  const target = interaction.options.getMember('miembro');
  const timeoutReason = interaction.options.getString('razon') ?? "No se especificó una razón.";

  if (target instanceof GuildMember) { // gonna have to take care of the other cases later

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
    return await interaction.reply({ content: 'Ocurrió un error con esta interaccióon.' })
  }
}