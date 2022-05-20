//@ts-check
const { CommandInteraction } = require("discord.js");

// Constants
const MIMETYPES = ["image/png", "image/jpeg", "image/gif"];

/**
 * @param {CommandInteraction} interaction 
 */
module.exports.UploadEmoji = async (interaction) => {
  if (!interaction.inCachedGuild()) return await interaction.reply('No puedes usar este comando fuera de un servidor.');

  const attachment = interaction.options.getAttachment('imagen', false);
  const emojiName = interaction.options.getString('nombre');
  let image = null;

  if (!MIMETYPES.includes(attachment.contentType))
    return await interaction.reply({
      content: 'Solo puedes subir imágenes de tipo `jpeg png gif`',
      ephemeral: true
    });

  if (attachment.size > 250_000) {
    // We need to resize to lower the size
    // TODO https://github.com/redgoose-dev/image-resize


  }

  try {
    await interaction.guild.emojis.create(attachment.url, emojiName, { reason: `Emoji creado por ${interaction.user.tag}` })

  } catch (e) {
    console.log(e)
    return await interaction.reply({
      content: 'Ocurrió un error al intentar crear este emoji. Verifica que no hayas superado el limite de emojis que puedes crear.',
      ephemeral: true
    }).catch(e => console.log(e));
  }
}

/**
 * @param {CommandInteraction} interaction 
 */
module.exports.UploadEmojiByURL = async (interaction) => {

}