// @ts-check

const { ChatInputCommandInteraction, EmbedBuilder, GuildMember, ChannelType } = require('discord.js');

/**
 * Command used to create and send announcements to any text channel 
 * @param {ChatInputCommandInteraction} interaction 
 */
module.exports.Announce = async (interaction) => {
  // valid options for this command
  // Required: canal, descripcion
  // Optional: titulo, color, imagen, pie, mencion1, mencion2, mencion3, miniatura
  if (interaction.inCachedGuild()) {
    const options = {
      channel: interaction.options.getChannel('canal', true),
      description: interaction.options.getString('descripcion', true).replace("\\n", "\n"),
      title: interaction.options.getString('titulo', false),
      color: interaction.options.getString('color', false),
      imageURL: interaction.options.getString('imagen', false),
      thumbnailURL: interaction.options.getString('miniatura', false),
      footer: interaction.options.getString('pie', false),
      mention1: interaction.options.getMentionable('mencion1', false) ?? " ",
      mention2: interaction.options.getMentionable('mencion2', false) ?? " ",
      mention3: interaction.options.getMentionable('mencion3', false) ?? " ",
    }

    if (options.channel.type !== ChannelType.GuildText)
      return await interaction.reply({ content: 'El canal que has ingresado no es un canal de texto, por favor ejecuta este comando nuevamente y asegúrate de usar un canal de texto.', ephemeral: true });

    if (interaction.guild.members.me?.permissionsIn(options.channel).has("SendMessages")) {

      if (options.description.length >= 1750)
        return await interaction.reply({ content: 'Lo siento, la cantidad de caracteres que has ingresado en la descripción excede el máximo establecido (1500+).', ephemeral: true })

      if (!(/^.*\.(jpg|gif|png|jpeg|webp)$/i.test(options.imageURL ?? "")))
        options.imageURL = null;

      if (!(/^.*\.(jpg|gif|png|jpeg|webp)$/i.test(options.thumbnailURL ?? "")))
        options.thumbnailURL = null;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Anuncio de ${interaction.member.displayName}`,
          iconURL: interaction.member.displayAvatarURL({ size: 64 }) ?? interaction.user.displayAvatarURL({ size: 64 }),
        })
        .setTitle(options.title ?? '')
        .setDescription(options.description)
        // @ts-ignore
        .setColor(Util.resolveColor(options.color))
        .setFooter({ text: options.footer ?? '' })
        .setImage(options.imageURL)
        .setThumbnail(options.thumbnailURL)

      // @ts-ignore
      const success = await options.channel.send({ embeds: [embed], content: `${options.mention1} ${options.mention2} ${options.mention3}` }).catch(console.error);

      if (!success)
        return await interaction.reply({ content: 'Ocurrió un error al intentar enviar el anuncio, revisa mis permisos dentro del canal y asegurate de que pueda enviar mensajes.', ephemeral: true });

      return await interaction.reply({ content: 'El anunció fue enviado con éxito.', ephemeral: true });

    }
  }
}