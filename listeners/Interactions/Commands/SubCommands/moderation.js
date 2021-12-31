//@ts-check
const { channelMention } = require("@discordjs/builders");
const { CommandInteraction, GuildMember, MessageEmbed } = require("discord.js");

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

/**
 * Command used to create and send announcements to any text channel 
 * @param {CommandInteraction} interaction 
 */
module.exports.Announce = async (interaction) => {
  // valid options for this command
  // Required: canal, descripcion
  // Optional: titulo, color, imagen, pie, mencionar

  const options = {
    channel: interaction.options.getChannel('canal', true),
    description: interaction.options.getString('descripcion', true),
    title: interaction.options.getString('titulo', false),
    color: interaction.options.getString('color', false),
    imageURL: interaction.options.getString('imagen', false),
    footer: interaction.options.getString('pie', false),
    mention: interaction.options.getMentionable('mencionar', false)
  }
  // @ts-ignore
  if (!options.channel.isText())
    return await interaction.reply({ content: 'El canal que has ingresado no es un canal de texto, por favor ejecuta este comando nuevamente y asegúrate de usar un canal de texto.', ephemeral: true });

  if (interaction.member instanceof GuildMember) {

    // @ts-ignore
    if (interaction.guild.me.permissionsIn(options.channel).has("SEND_MESSAGES")) {

      if (options.description.length >= 1750)
        return await interaction.reply({ content: 'Lo siento, la cantidad de caracteres que has ingresado en la descripción excede el máximo establecido (1500+).', ephemeral: true })

      if (/^.*\.(jpg|gif|png|jpeg|webp)$/i.test(options.imageURL))
        options.imageURL = null;

      const embed = new MessageEmbed()
        .setAuthor({
          name: `Anuncio de ${interaction.member.displayName}`,
          iconURL: interaction.member.displayAvatarURL({ size: 64, dynamic: true }) ?? interaction.user.displayAvatarURL({ size: 64, dynamic: true }),
        })
        .setTitle(options.title ?? '')
        .setDescription(options.description)
        // @ts-ignore
        .setColor(options.color ?? "BLUE")
        .setFooter({ text: options.footer ?? '' })
        .setImage(options.imageURL)

      // @ts-ignore
      const success = await options.channel.send({ embeds: [embed], content: options.mention ?? " " }).catch(console.error);



      if (!success)
        return await interaction.reply({ content: 'Ocurrió un error al intentar enviar el anuncio, revisa mis permisos dentro del canal y asegurate de que pueda enviar mensajes.', ephemeral: true });

      return await interaction.reply({ content: 'El anunció fue enviado con éxito.', ephemeral: true });

    }
  }
}